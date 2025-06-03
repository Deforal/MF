<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['amount' => 0]);
    exit;
}

$userId = $_SESSION['user']['id'];

$stmt = $pdo->prepare("SELECT SUM(Amount) as total FROM Cart WHERE User_id = ?");
$stmt->execute([$userId]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(['amount' => (int) $result['total']]);