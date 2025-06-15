<?php
require_once "db.php";

$validFilters = ['Flavour', 'Size', 'Category', 'Type'];
$where = ["Products.Amount_avbl > 0"];
$params = [];

// Base query — join only for GROUP_CONCAT
$sql = "SELECT Products.*, 
               GROUP_CONCAT(DISTINCT pf_all.flavour ORDER BY pf_all.flavour SEPARATOR ', ') AS Flavour,
               (SELECT URL FROM Images WHERE Images.Product_id = Products.id AND Selection = 0 LIMIT 1) AS image,
               (SELECT COUNT(*) FROM Review WHERE Review.Product_id = Products.id) AS ReviewCount,
               (SELECT Name FROM Descriptions WHERE Descriptions.id = Products.Group_id ) AS NewName,
               (SELECT ROUND(AVG(Rating),1) FROM Review WHERE Review.Product_id = Products.id) AS Rating
        FROM Products
        LEFT JOIN Product_Flavours pf_all ON pf_all.product_id = Products.id";

// Filtering
foreach ($validFilters as $filter) {
    if (isset($_GET[$filter])) {
        if ($filter === 'Flavour') {
            $flavours = explode(',', $_GET['Flavour']);
            $placeholders = [];
            foreach ($flavours as $index => $flavour) {
                $key = "Flavour$index";
                $placeholders[] = ":$key";
                $params[$key] = trim($flavour);
            }

            $where[] = "Products.id IN (
                SELECT product_id 
                FROM Product_Flavours 
                WHERE flavour IN (" . implode(',', $placeholders) . ")
                GROUP BY product_id 
                HAVING COUNT(DISTINCT flavour) = :flavourCount
            )";
            $params['flavourCount'] = count($flavours);
        } else {
            $where[] = "Products.`$filter` = :$filter";
            $params[$filter] = $_GET[$filter];
        }
    }
}

if (isset($_GET['sale']) && $_GET['sale'] == '1') {
    $where[] = "Products.Second_price IS NOT NULL";
}

if (!empty($where)) {
    $sql .= " WHERE " . implode(' AND ', $where);
}

$sql .= " GROUP BY Products.id";

// Sorting
$sort = $_GET['sort'] ?? '';
switch ($sort) {
    case 'price-asc':
        $sql .= " ORDER BY Flavour ASC, Products.Price ASC";
        break;
    case 'price-desc':
        $sql .= " ORDER BY Flavour ASC, Products.Price DESC";
        break;
    case 'sales-desc':
        $sql .= " ORDER BY Flavour ASC, Products.amount_sold DESC";
        break;
    default:
        $sql .= " ORDER BY Flavour ASC";
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
