<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Пользователь не авторизован"]);
    exit;
}

require_once 'db.php';

$userId = $_SESSION['user']['id'];
$productId = $_POST['Product_id'] ?? null;
$amount = $_POST['Amount'] ?? 1;

if (!$productId || $amount < 1) {
    echo json_encode(["success" => false, "message" => "Некорректные данные"]);
    exit;
}

// Check if product already in cart → increment
$stmt = $pdo->prepare("SELECT id, Amount FROM Cart WHERE User_id = ? AND Product_id = ?");
$stmt->execute([$userId, $productId]);
$existing = $stmt->fetch();

if ($existing) {
    $newAmount = $existing['Amount'] + $amount;
    $stmt = $pdo->prepare("UPDATE Cart SET Amount = ? WHERE id = ?");
    $stmt->execute([$newAmount, $existing['id']]);
} else {
    $stmt = $pdo->prepare("INSERT INTO Cart (User_id, Product_id, Amount) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $productId, $amount]);
}

echo json_encode(["success" => true]);