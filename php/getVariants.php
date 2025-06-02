<?php
require_once 'db.php';

$product_id = $_GET['id'] ?? null;
if (!$product_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product id']);
    exit;
}

// First, find the group_id for the given product
$stmt = $pdo->prepare("SELECT group_id FROM Products WHERE id = ?");
$stmt->execute([$product_id]);
$group = $stmt->fetch();

if (!$group) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
    exit;
}

$group_id = $group['group_id'];

// Get all variants for this group
$variantStmt = $pdo->prepare("SELECT * FROM Products WHERE group_id = ?");
$variantStmt->execute([$group_id]);
$variants = $variantStmt->fetchAll(PDO::FETCH_ASSOC);

// Get description data
$descStmt = $pdo->prepare("SELECT name, overview, benefits, suggest FROM Descriptions WHERE id = ?");
$descStmt->execute([$group_id]);
$description = $descStmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'variants' => $variants,
    'description' => $description
]);
