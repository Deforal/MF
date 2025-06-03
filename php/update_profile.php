<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Ensure user is logged in
if (!isset($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Вы не авторизованы.']);
    exit;
}

$user_id = $_SESSION['user']['id'];

// Decode JSON payload
$data = json_decode(file_get_contents("php://input"), true);
$field = $data['field'] ?? null;
$value = $data['value'] ?? null;

$allowedFields = ['Name', 'Email', 'Phone', 'Birth', 'Gender'];

if (!$field || !in_array($field, $allowedFields)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Недопустимое поле.']);
    exit;
}

// Prepare and run the update
$query = "UPDATE Users SET `$field` = :value WHERE id = :id";
$stmt = $pdo->prepare($query);
$stmt->execute(['value' => $value, 'id' => $user_id]);

// Update session
$_SESSION['user'][$field] = $value;

echo json_encode(['success' => true, 'message' => 'Поле обновлено.']);