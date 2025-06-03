<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$userId = $_SESSION['user']['id'];
$productId = $data['productId'];
$amount = $data['amount'];

$stmt = $pdo->prepare("UPDATE Cart SET Amount = ? WHERE User_id = ? AND Product_id = ?");
$stmt->execute([$amount, $userId, $productId]);

echo json_encode(["success" => true]);