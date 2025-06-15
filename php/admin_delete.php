<?php
require_once './db.php';
require_once 'is_admin.php';
require_admin();

$data = json_decode(file_get_contents("php://input"), true);
$table = $data['table'] ?? '';
$id = $data['id'] ?? '';
echo $id;
if ($table && $id) {
    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo "Deleted";
} else {
    http_response_code(400);
    echo "Invalid data";
}