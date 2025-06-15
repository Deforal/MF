<?php
session_start();

function is_admin(): bool
{
    return $_SESSION['user']['Role'] === 1;
}

function require_admin()
{
    if (!is_admin()) {
        http_response_code(403);
        echo "Доступ запрещён";
        exit;
    }
}