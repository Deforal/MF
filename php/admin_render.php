<?php
require_once './db.php';

$table = $_GET['table'] ?? '';

// Optional: allow only specific tables if security matters
$allowedTables = ['products', 'descriptions', 'images', 'users', 'cart', 'favs', 'review'];
if (!in_array($table, $allowedTables)) {
    echo "<tr><td>Неверный параметр таблицы</td></tr>";
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM `$table`");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rows) {
        echo "<tr><td colspan='100%'>Нет данных в таблице</td></tr>";
        exit;
    }

    // Dynamically extract column names
    $columns = array_keys($rows[0]);

    // Render header
    $html = "<tr>";
    foreach ($columns as $col) {
        $html .= "<th>{$col}</th>";
    }
    $html .= "</tr>";

    // Render rows
    foreach ($rows as $row) {
        $html .= "<tr>";
        foreach ($columns as $col) {
            $value = htmlspecialchars($row[$col]);
            $id = htmlspecialchars($row['id'] ?? '');
            $html .= "<td contenteditable='true' data-column='{$col}' data-id='{$id}'>{$value}</td>";
        }
        $html .= "<td data-column='delete' data-id='{$id}'><button class='delete-btn'>Удалить</button></td>";
        $html .= "</tr>";
    }
    $html .= "<tr><td colspan='" . (count($columns) + 1) . "'>";
    $html .= "<form class='insert-form' data-table='{$table}'>";

    foreach ($columns as $col) {
        if ($col === 'id')
            continue; // Skip auto-increment ID

        $isDescriptions = $table === 'descriptions';
        $isLongTextField = in_array($col, ['List', 'Overview', 'Benefits', 'Suggest']);

        $html .= "<label>{$col}: ";
        if ($isDescriptions && $isLongTextField) {
            $html .= "<textarea name='{$col}' style='bg' required></textarea>";
        } else {
            $html .= "<input name='{$col}' style='bg' required>";
        }
        $html .= "</label> ";
    }

    $html .= "<button type='submit'>Добавить</button>";
    $html .= "</form></td></tr>";

    echo $html;
} catch (PDOException $e) {
    echo "<tr><td colspan='100%'>Ошибка: {$e->getMessage()}</td></tr>";
}