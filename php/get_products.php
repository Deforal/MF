<?php
require_once "db.php";

$validFilters = ['Flavour', 'Size', 'Category', 'Type'];
$where = [];
$params = [];

foreach ($validFilters as $filter) {
    if (isset($_GET[$filter])) {
        $where[] = "`$filter` = :$filter";
        $params[$filter] = $_GET[$filter];
    }
}

$sql = "SELECT Products.*, 
               (SELECT URL FROM Images WHERE Images.Product_id = Products.id AND Selection = 0 LIMIT 1) AS image,
               (SELECT COUNT(*) FROM Review WHERE Review.Product_id = Products.id) AS ReviewCount,
               (SELECT Name FROM Descriptions WHERE Descriptions.id = Products.Group_id ) AS NewName,
               (SELECT ROUND(AVG(Rating), 1) FROM Review WHERE Review.Product_id = Products.id) AS Rating
        FROM Products";

if (!empty($where)) {
    $sql .= " WHERE " . implode(' AND ', $where);
}
if (isset($_GET['sale']) && $_GET['sale'] == '1') {
    $where[] = "Second_price IS NOT NULL";
}

$sort = $_GET['sort'] ?? '';
switch ($sort) {
    case 'price_asc':
        $sql .= " ORDER BY Price ASC";
        break;
    case 'price_desc':
        $sql .= " ORDER BY Price DESC";
        break;
    case 'sales_desc':
        $sql .= " ORDER BY amount_sold DESC";
        break;
    case 'sales_asc':
        $sql .= " ORDER BY amount_sold ASC";
        break;
}

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $value) {
    $stmt->bindValue(":$key", $value);
}

$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($products);
