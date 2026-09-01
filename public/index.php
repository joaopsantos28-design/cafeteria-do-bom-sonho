<?php
require dirname(__DIR__) . '/vendor/autoload.php';
require dirname(__DIR__) . '/app/helpers.php';

use App\Core\Auth;
Auth::start();
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';

if ($path === '/sair') { Auth::logout(); header('Location: /'); exit; }
if ($path !== '/' && !Auth::check()) { header('Location: /'); exit; }

$routes = [
  '/' => ['App\\Controllers\\AuthController', 'login'],
  '/entrar' => ['App\\Controllers\\AuthController', 'authenticate'],
  '/pedidos' => ['App\\Controllers\\DashboardController', 'orders'],
  '/pedidos/novo' => ['App\\Controllers\\DashboardController', 'newOrder'],
  '/produtos' => ['App\\Controllers\\DashboardController', 'products'],
  '/produtos/novo' => ['App\\Controllers\\DashboardController', 'newProduct'],
  '/funcionarios' => ['App\\Controllers\\DashboardController', 'staff'],
  '/funcionarios/novo' => ['App\\Controllers\\DashboardController', 'newStaff'],
];
if (!isset($routes[$path])) { http_response_code(404); exit('Página não encontrada'); }
[$class, $method] = $routes[$path]; (new $class())->$method();
