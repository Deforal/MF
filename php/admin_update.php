<?php
require_once './db.php';

$data = json_decode(file_get_contents("php://input"), true);
$table = $data['table'] ?? '';
$id = $data['id'] ?? '';
$column = $data['column'] ?? '';
$value = isset($data['value']) ? trim($data['value']) : null;

if ($table && $id && $column) {
    // Convert empty string to NULL
    $value = $value === '' ? null : $value;

    $stmt = $pdo->prepare("UPDATE `$table` SET `$column` = :value WHERE id = :id");
    $stmt->bindValue(':value', $value, is_null($value) ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(["success" => true]);
} else {
    http_response_code(400);
    echo "Invalid data";
}