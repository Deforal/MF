<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$userId = $_SESSION['user']['id'];
$productId = $data['productId'];

$stmt = $pdo->prepare("DELETE FROM Cart WHERE User_id = ? AND Product_id = ?");
$stmt->execute([$userId, $productId]);

echo json_encode(["success" => true]);