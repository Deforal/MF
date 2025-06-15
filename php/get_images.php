<?php
include 'db.php'; // Connect DB
$productId = intval($_GET['product_id']);

$stmt = $pdo->prepare("SELECT * FROM Images WHERE Product_id = ? ORDER BY id ASC");
$stmt->execute([$productId]);
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
if ($images) {
    echo json_encode(['success' => $images]);
} else {
    echo json_encode(['error' => 'Не удалось получить изображения']);
}

