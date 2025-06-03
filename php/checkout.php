<?php
session_start();
require_once 'db.php'; // Assumes you connect PDO as $pdo

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'error' => 'Неавторизованный доступ.']);
    exit;
}

$userId = $_SESSION['user']['id'];
if (!isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'error' => 'ID пользователя не найден в сессии.']);
    exit;
}

// 1. Get all cart items for this user
$stmt = $pdo->prepare("SELECT c.Product_id, c.Amount FROM Cart c WHERE c.User_id = ?");
$stmt->execute([$userId]);
$cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$cartItems || count($cartItems) === 0) {
    echo json_encode(['success' => false, 'error' => 'Корзина пуста.']);
    exit;
}

// 2. Start transaction
$pdo->beginTransaction();
try {
    $now = date('Y-m-d H:i:s');

    foreach ($cartItems as $item) {
        $check = $pdo->prepare("SELECT Amount_avbl FROM Products WHERE id = ?");
        $check->execute([$item['Product_id']]);
        $available = $check->fetchColumn();
        if (!$available) {
            throw new Exception("Продукт не найден.");
        }
        if ($available < $item['Amount']) {
            throw new Exception("Недостаточно товара на складе.");
        }
        // 2.1 Insert into Orders table
        $stmt = $pdo->prepare("INSERT INTO Orders (User_id, Product_id, Amount, Date, Status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $item['Product_id'], $item['Amount'], $now, 'Ожидает']);


        // 2.2 Decrease from Products.Amount_avbl, increase Products.Amount_sold
        $update = $pdo->prepare("UPDATE Products SET Amount_avbl = Amount_avbl - ?, Amount_sold = Amount_sold + ? WHERE id = ?");
        $update->execute([$item['Amount'], $item['Amount'], $item['Product_id']]);
    }

    // 3. Clear cart
    $clear = $pdo->prepare("DELETE FROM Cart WHERE User_id = ?");
    $clear->execute([$userId]);

    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}