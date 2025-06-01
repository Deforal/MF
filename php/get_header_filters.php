<?php
require_once 'db.php';

$filters = [];

$columns = ['Type', 'Category', 'Size'];
foreach ($columns as $col) {
    $stmt = $conn->prepare("SELECT DISTINCT `$col` FROM Products WHERE `$col` IS NOT NULL AND `$col` != ''");
    $stmt->execute();
    $result = $stmt->get_result();

    $values = [];
    while ($row = $result->fetch_assoc()) {
        $values[] = $row[$col];
    }

    $filters[strtolower($col)] = $values;
}

echo json_encode($filters);

