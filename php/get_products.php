<?php
require_once "db.php";

$validFilters = ['Flavour', 'Size', 'Category', 'Type'];
$where = [];
$params = [];
$types = '';

foreach ($validFilters as $filter) {
    if (isset($_GET[$filter])) {
        $where[] = "`$filter` = ?";
        $params[] = $_GET[$filter];
        $types .= 's';
    }
}
if (isset($_GET['sale']) && $_GET['sale'] == '1') {
    $where[] = "Second_price IS NOT NULL";
}

// Base SQL
$sql = "SELECT Products.*, 
               (SELECT URL FROM Images WHERE Images.Product_id = Products.id AND Selection = 0 LIMIT 1) AS image,
               (SELECT COUNT(*) FROM Review WHERE Review.Product_id = Products.id) AS ReviewCount,
               (SELECT ROUND(AVG(Rating), 1) FROM Review WHERE Review.Product_id = Products.id) AS Rating
        FROM Products";

// Add filters if present
if (!empty($where)) {
    $sql .= " WHERE " . implode(' AND ', $where);
}

// Add sorting based on `sort` parameter
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
    default:
        break;
}

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header('Content-Type: application/json');
echo json_encode($products);