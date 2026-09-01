<?php
$pageTitle = $pageTitle ?? 'Cafeteria do bom sonho';
$activePage = $activePage ?? '';
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($pageTitle) ?> | Cafeteria do bom sonho</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="pedidos.php">
        <img src="../public/gato-cafe.png" alt="Gato abraçado a uma xícara de café">
        <span><strong>Cafeteria</strong><small>do bom sonho</small></span>
      </a>
      <nav class="nav" aria-label="Navegação principal">
        <a class="<?= $activePage === 'pedidos' ? 'active' : '' ?>" href="pedidos.php">Pedidos abertos</a>
        <a class="<?= $activePage === 'produtos' ? 'active' : '' ?>" href="produtos.php">Produtos / cardápio</a>
        <a class="<?= $activePage === 'funcionarios' ? 'active' : '' ?>" href="funcionarios.php">Funcionários</a>
      </nav>
      <div class="sidebar-bottom">
        <div class="profile"><span class="avatar">MB</span><span><strong>Maria Barista</strong><small>Atendente</small></span></div>
        <a class="logout" href="index.php">Sair da conta</a>
      </div>
    </aside>
    <main class="main-content">
