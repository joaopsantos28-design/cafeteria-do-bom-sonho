<?php
namespace App\Core;

final class Auth
{
    public static function start(): void { if (session_status() !== PHP_SESSION_ACTIVE) session_start(); }
    public static function login(array $user): void { self::start(); session_regenerate_id(true); $_SESSION['user'] = ['id' => $user['id'], 'nome' => $user['nome'], 'cargo' => $user['cargo']]; }
    public static function user(): ?array { self::start(); return $_SESSION['user'] ?? null; }
    public static function logout(): void { self::start(); $_SESSION = []; session_destroy(); }
    public static function check(): bool { return self::user() !== null; }
}
