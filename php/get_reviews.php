<?php
require 'db.php';

$productId = $_GET['product_id'] ?? 0;

// Step 1: Find the group_id of the current product
$groupStmt = $pdo->prepare("SELECT Group_id FROM Products WHERE id = ?");
$groupStmt->execute([$productId]);
$groupId = $groupStmt->fetchColumn();

if ($groupId === false) {
    echo json_encode([]); // Product not found or invalid ID
    exit;
}

// Step 2: Get reviews of all products with the same group_id
$stmt = $pdo->prepare("
    SELECT r.*, u.Name AS UserName,
           p.Flavour, p.Size, p.Group_id,
           d.Name AS GroupName
    FROM Review r
    JOIN Users u ON r.User_id = u.id
    JOIN Products p ON r.Product_id = p.id
    JOIN Descriptions d ON p.Group_id = d.id
    WHERE p.Group_id = ?
");

$stmt->execute([$groupId]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reviews);