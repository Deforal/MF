<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'Пользователь не вошел']);
    exit;
}

$userId = $_SESSION['user']['id'];

$stmt = $pdo->prepare("
    SELECT 
        p.id,
        c.Amount,
        p.Flavour,
        p.Size,
        p.Price,
        p.Second_price,
        i.URL,
        CONCAT(d.Name, ' ', p.Flavour, ' ', p.Size) AS FullName
    FROM Cart c
    JOIN Products p ON c.Product_id = p.id
    JOIN Descriptions d ON p.Group_id = d.id
    LEFT JOIN Images i ON i.Product_id = p.id AND i.Selection = 0
    WHERE c.User_id = ?
");
$stmt->execute([$userId]);
$cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($cartItems as &$item) {
    $item['FinalPrice'] = $item['Second_price'] ?? $item['Price'];
}
echo json_encode(['cart' => $cartItems]);