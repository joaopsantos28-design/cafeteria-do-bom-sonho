<?php
namespace App\Core;

abstract class Controller
{
    protected function view(string $name, array $data = []): void
    {
        extract($data);
        $name = $name;
        require __DIR__ . '/../Views/layout.php';
    }
    protected function redirect(string $path): never
    {
        header('Location: ' . $path);
        exit;
    }
}
