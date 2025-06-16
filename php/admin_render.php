<?php
require_once './db.php';
require_once 'is_admin.php';
require_admin();

$table = $_GET['table'] ?? '';


try {
    if ($table == 'images') {
        $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY Product_id ASC, Selection ASC");
    } elseif ($table == 'products') {
        $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY Group_id ASC, Flavour ASC");
    } elseif ($table == 'orders') {
        $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY User_id ASC");
    } elseif ($table == 'review') {
        $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY Product_id ASC");
    } elseif ($table == 'users') {
        $stmt = $pdo->query("SELECT id, Role, Name, Email, Phone, Birth, Gender FROM `$table` ORDER BY id ASC");
    } else {
        $stmt = $pdo->query("SELECT * FROM `$table` ORDER BY id ASC");
    }

    function formInsert($columns, $table): string
    {
        $html = "<tr><td colspan='" . (count($columns) + 1) . "'>";
        $html .= "<form class='insert-form' data-table='{$table}'>";

        foreach ($columns as $col) {
            if ($col === 'id')
                continue;

            $isDescriptions = $table === 'descriptions';
            $isLongTextField = in_array($col, ['List', 'Overview', 'Benefits', 'Suggest']);

            $html .= "<label>{$col}: ";
            if ($isDescriptions && $isLongTextField) {
                $html .= "<textarea name='{$col}' required></textarea>";
            } else {
                $html .= "<input name='{$col}'" . ($col === 'Second_price' ? '' : ' required') . ">";
            }
            $html .= "</label> ";
        }

        $html .= "<button type='submit'>Добавить</button>";
        $html .= "</form></td></tr>";
        return $html;
    }

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $html = "";

    // Extract columns from the structure (not just from rows)
    if ($rows) {
        $columns = array_keys($rows[0]);
    } else {
        // Fallback: fetch column info using PDO
        $descStmt = $pdo->query("DESCRIBE `$table`");
        $columns = [];
        while ($col = $descStmt->fetch(PDO::FETCH_ASSOC)) {
            $columns[] = $col['Field'];
        }
    }

    // Render table header
    $html .= "<tr>";
    foreach ($columns as $col) {
        $html .= "<th>{$col}</th>";
    }
    $html .= "<th>Действия</th></tr>";

    // Render rows if they exist
    if ($rows) {
        foreach ($rows as $row) {
            $html .= "<tr>";
            foreach ($columns as $col) {
                $value = htmlspecialchars($row[$col]);
                $id = htmlspecialchars($row['id'] ?? '');
                $html .= "<td contenteditable='true' data-column='{$col}' data-id='{$id}'>{$value}</td>";
            }
            if ($table == "Users" && $row["id"] == $_SESSION['user']['id']) {
                $html .= "<td><p>Ваш аккаунт</p></td>";
            } else {
                $html .= "<td><button class='delete-btn' data-id='{$id}'>Удалить</button></td>";
            }
            $html .= "</tr>";
        }
    } else {
        $html .= "<tr><td colspan='" . (count($columns) + 1) . "'>Нет данных в таблице</td></tr>";
    }

    // Render form at the bottom
    $html .= formInsert($columns, $table);

    echo $html;

} catch (PDOException $e) {
    echo "<tr><td colspan='100%'>Ошибка: {$e->getMessage()}</td></tr>";
}
