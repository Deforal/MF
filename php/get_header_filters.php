<?php
require_once 'db.php';

$filters = [];
$columns = ['Type', 'Category', 'Size', 'Flavour'];

foreach ($columns as $col) {
    $stmt = $pdo->prepare("SELECT DISTINCT `$col` FROM Products WHERE `$col` IS NOT NULL AND `$col` != ''");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $values = [];
    foreach ($rows as $row) {
        $values[] = $row[$col];
    }

    $filters[strtolower($col)] = $values;
}

echo json_encode($filters);
