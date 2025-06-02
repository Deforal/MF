<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$birth = $data['birth'] ?? '';
$gender = $data['gender'] ?? '';
$pass = $data['pass'] ?? '';

if (!$name || !$email || !$phone || !$birth || !$gender || !$pass) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Заполните все поля.']);
    exit;
}

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM Users WHERE Email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email уже используется.']);
    exit;
}

$hashedPass = password_hash($pass, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO Users (Name, Email, Phone, Birth, Gender, Pass) VALUES (?, ?, ?, ?, ?, ?)");
$success = $stmt->execute([$name, $email, $phone, $birth, $gender, $hashedPass]);

if ($success) {
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['user_name'] = $name;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка регистрации.']);
}