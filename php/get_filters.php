<?php
require_once "db.php";

function getFilterOptions($pdo, $column)
{
    $stmt = $pdo->prepare("SELECT `$column`, COUNT(*) as count FROM Products GROUP BY `$column`");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $options = [];
    foreach ($results as $row) {
        $options[] = ['value' => $row[$column], 'count' => $row['count']];
    }
    return $options;
}

$filters = [
    'Вкус' => getFilterOptions($pdo, 'Flavour'),
    'Вес' => getFilterOptions($pdo, 'Size'),
    'Категория' => getFilterOptions($pdo, 'Category'),
    'Тип' => getFilterOptions($pdo, 'Type')
];

header('Content-Type: application/json');
echo json_encode($filters);
