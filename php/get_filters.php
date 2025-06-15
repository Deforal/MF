<?php
require_once "db.php";

// Normal filters with counts
function getFilterOptions($pdo, $column, $forHeader = false)
{
    $stmt = $pdo->prepare("
        SELECT `$column`, COUNT(*) as count 
        FROM Products 
        WHERE `$column` IS NOT NULL AND `$column` != '' AND Amount_avbl > 0 
        GROUP BY `$column` 
        ORDER BY `$column` ASC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($forHeader) {
        return array_column($results, $column);
    }

    $options = [];
    foreach ($results as $row) {
        $options[] = ['value' => $row[$column], 'count' => $row['count']];
    }
    return $options;
}

// Flavours from a separate table
function getFlavourOptions($pdo, $forHeader = false)
{
    $stmt = $pdo->query("
        SELECT Product_Flavours.flavour, COUNT(DISTINCT Product_Flavours.product_id) AS count
        FROM Product_Flavours
        JOIN Products ON Products.id = Product_Flavours.product_id
        WHERE Products.Amount_avbl > 0
        GROUP BY Product_Flavours.flavour
        ORDER BY Product_Flavours.flavour ASC
    ");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($forHeader) {
        return array_column($results, 'flavour');
    }

    $options = [];
    foreach ($results as $row) {
        $options[] = ['value' => $row['flavour'], 'count' => $row['count']];
    }
    return $options;
}

// Check for header mode
$isHeader = isset($_GET['header']) && $_GET['header'] == 1;

if ($isHeader) {
    $filters = [
        'type' => getFilterOptions($pdo, 'Type', true),
        'category' => getFilterOptions($pdo, 'Category', true),
        'size' => getFilterOptions($pdo, 'Size', true),
        'flavour' => getFlavourOptions($pdo, true)
    ];
} else {
    $filters = [
        'Вкус' => getFlavourOptions($pdo),
        'Вес' => getFilterOptions($pdo, 'Size'),
        'Категория' => getFilterOptions($pdo, 'Category'),
        'Тип' => getFilterOptions($pdo, 'Type')
    ];
}

header('Content-Type: application/json');
echo json_encode($filters);
