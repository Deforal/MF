<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$pass = $data['pass'] ?? '';

if (!$email || !$pass) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Введите Email и Пароль.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM Users WHERE Email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($pass, $user['Pass'])) {
    $_SESSION['user'] = $user;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Неверные данные.']);
}
