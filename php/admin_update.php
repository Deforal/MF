<?php
require_once './db.php';

$data = json_decode(file_get_contents("php://input"), true);
$table = $data['table'] ?? '';
$id = $data['id'] ?? '';
$column = $data['column'] ?? '';
$value = $data['value'] ?? '';

if ($table && $id && $column) {
    $stmt = $pdo->prepare("UPDATE `$table` SET `$column` = :value WHERE id = :id");
    $stmt->execute(['value' => $value, 'id' => $id]);
    echo "OK";
} else {
    http_response_code(400);
    echo "Invalid data";
}