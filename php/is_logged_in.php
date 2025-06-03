<?php
session_start();
if (isset($_SESSION['user'])) {
    echo json_encode(['loggedIn' => isset($_SESSION['user']), 'user' => $_SESSION['user']]);
} else {
    echo json_encode(['error' => 'Пользователь не вошел', 'loggedIn' => false]);
}
