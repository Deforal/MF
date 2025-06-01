<?php
require_once "db.php";
function getFilterOptions($conn, $column)
{
    $query = "SELECT `$column`, COUNT(*) as count FROM Products GROUP BY `$column`";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        die("Prepare failed for column `$column`: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $options = [];
    while ($row = $result->fetch_assoc()) {
        $options[] = ['value' => $row[$column], 'count' => $row['count']];
    }
    return $options;
}

// Retrieve filter options
$filters = [
    'Flavour' => getFilterOptions($conn, 'Flavour'),
    'Size' => getFilterOptions($conn, 'Size'),
    'Category' => getFilterOptions($conn, 'Category'),
    'Type' => getFilterOptions($conn, 'Type')
];

// Return as JSON
header('Content-Type: application/json');
echo json_encode($filters);
