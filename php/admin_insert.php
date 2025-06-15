<?php
require_once './db.php';
require_once 'is_admin.php';
require_admin();

$table = $_POST['table'] ?? '';
$allowedTables = ['products', 'descriptions', 'images', 'users', 'cart', 'favs', 'review'];
if (!in_array($table, $allowedTables)) {
    echo "invalid table";
    exit;
}

try {
    $columns = $pdo->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_COLUMN);
    $insertCols = array_filter($columns, fn($col) => $col !== 'id');

    $placeholders = array_map(fn($col) => ":$col", $insertCols);
    $sql = "INSERT INTO `$table` (" . implode(',', $insertCols) . ") VALUES (" . implode(',', $placeholders) . ")";
    $stmt = $pdo->prepare($sql);

    $data = [];
    foreach ($insertCols as $col) {
        $value = trim($_POST[$col] ?? '');

        // Convert empty string to NULL
        $data[":$col"] = $value === '' ? null : $value;
    }

    $stmt->execute($data);
    echo "success";
} catch (PDOException $e) {
    echo "DB error: " . $e->getMessage();
}
