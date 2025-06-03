<?php
require_once 'db.php';

$product_id = $_GET['id'] ?? null;
if (!$product_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product id']);
    exit;
}

// Step 1: Get the group_id of the product
$stmt = $pdo->prepare("SELECT group_id FROM Products WHERE id = ?");
$stmt->execute([$product_id]);
$group = $stmt->fetch();

if (!$group) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
    exit;
}

$group_id = $group['group_id'];

// Step 2: Get description for the group
$descStmt = $pdo->prepare("SELECT name, list, overview, benefits, suggest FROM Descriptions WHERE id = ?");
$descStmt->execute([$group_id]);
$description = $descStmt->fetch(PDO::FETCH_ASSOC);

// Step 3: Get all product variants in the group, with joined data
$variantStmt = $pdo->prepare("
    SELECT 
        p.*,
        (SELECT URL FROM Images WHERE Images.Product_id = p.id AND Selection = 0 LIMIT 1) AS image,
        (SELECT COUNT(*) FROM Review WHERE Review.Product_id = p.id) AS ReviewCount,
        (SELECT ROUND(AVG(Rating), 1) FROM Review WHERE Review.Product_id = p.id) AS Rating,
        CONCAT(p.Group_id, ' ', d.Name, ' ', p.Flavour, ' ', p.Size) AS NewName
    FROM Products p
    JOIN Descriptions d ON p.Group_id = d.id
    WHERE p.Group_id = ?
");
$variantStmt->execute([$group_id]);
$variants = $variantStmt->fetchAll(PDO::FETCH_ASSOC);

// Step 4: Attach reviews for each variant
foreach ($variants as &$variant) {
    $reviewStmt = $pdo->prepare("
        SELECT r.Title, r.Text, r.Rating, r.Date, u.Name AS UserName
        FROM Review r
        JOIN Users u ON r.User_id = u.id
        WHERE r.Product_id = ?
        ORDER BY r.Date DESC
    ");
    $reviewStmt->execute([$variant['id']]);
    $variant['Reviews'] = $reviewStmt->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode([
    'variants' => $variants,
    'description' => $description
]);