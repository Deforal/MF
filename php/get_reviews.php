<?php
require 'db.php';

$productId = $_GET['product_id'] ?? 0;

$stmt = $pdo->prepare("
    SELECT r.*, u.Name AS UserName,
           p.Flavour, p.Size, p.Group_id,
           d.Name AS GroupName
    FROM Review r
    JOIN Users u ON r.User_id = u.id
    JOIN Products p ON r.Product_id = p.id
    JOIN Descriptions d ON p.Group_id = d.id
    WHERE r.Product_id = ?
");

$stmt->execute([$productId]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reviews);