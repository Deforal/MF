<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user'])) {
    http_response_code(403);
    exit('Not logged in');
}

$data = json_decode(file_get_contents("php://input"), true);
$stmt = $pdo->prepare("INSERT INTO Review (Product_id, User_id, Rating, Title, Text, Date) VALUES (?, ?, ?, ?, ?, NOW())");
$stmt->execute([
    $data['product_id'],
    $_SESSION['user']['id'],
    $data['rating'],
    $data['title'],
    $data['text']
]);

echo json_encode(['success' => true]);