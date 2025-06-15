<?php
require_once 'db.php';
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT * FROM Descriptions");
$descriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'data' => $descriptions]);
