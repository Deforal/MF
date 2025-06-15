<?php
require_once './db.php';
session_start();

$userId = $_SESSION['user']['id'] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authorized']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT o.id, o.Product_id, o.Amount, o.Date, o.Status,
               p.Flavour, p.Size, d.Name AS NewName,
               (SELECT URL FROM images WHERE Product_id = p.id AND Selection = 0 LIMIT 1) AS image
        FROM Orders o
        JOIN Products p ON o.Product_id = p.id
        JOIN Descriptions d ON p.Group_id = d.id
        WHERE o.User_id = ?
        ORDER BY o.Date DESC
    ");
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}