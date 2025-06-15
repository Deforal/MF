<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'error' => 'Неавторизованный доступ.']);
    exit;
}

$userId = $_SESSION['user']['id'];

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
        $check = $pdo->prepare("
            SELECT p.Amount_avbl, p.Flavour, p.Size, d.Name AS DescriptionName
            FROM Products p
            JOIN Descriptions d ON p.Group_id = d.id
            WHERE p.id = ?
        ");
        $check->execute([$item['Product_id']]);
        $product = $check->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception("Продукт с ID {$item['Product_id']} не найден.");
        }

        if ($product['Amount_avbl'] < $item['Amount']) {
            $flavour = htmlspecialchars($product['Flavour']);
            $size = htmlspecialchars($product['Size']);
            $descName = htmlspecialchars($product['DescriptionName']);
            throw new Exception("Недостаточно товара: {$descName} ({$flavour}, {$size}) — на складе: {$product['Amount_avbl']}.");
        }

        // Insert into Orders
        $stmt = $pdo->prepare("INSERT INTO Orders (User_id, Product_id, Amount, Date, Status) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $item['Product_id'], $item['Amount'], $now, 'Ожидает']);

        // Update Product inventory
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