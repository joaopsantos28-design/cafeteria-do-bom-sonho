<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\Database;

final class DashboardController extends Controller
{
    private function render(string $view, array $data = []): void { $this->view($view, $data + ['user' => \App\Core\Auth::user()]); }
    public function orders(): void { $this->render('dashboard/orders', ['title' => 'Pedidos abertos', 'active' => 'pedidos']); }
    public function newOrder(): void { $this->render('dashboard/form', ['title' => 'Novo pedido', 'active' => 'pedidos', 'form' => 'order']); }
    public function products(): void { $this->render('dashboard/products', ['title' => 'Cardápio', 'active' => 'produtos']); }
    public function newProduct(): void { $this->render('dashboard/form', ['title' => 'Novo produto', 'active' => 'produtos', 'form' => 'product']); }
    public function staff(): void { $this->render('dashboard/staff', ['title' => 'Funcionários', 'active' => 'funcionarios']); }
    public function newStaff(): void { $this->render('dashboard/form', ['title' => 'Novo funcionário', 'active' => 'funcionarios', 'form' => 'staff']); }
}
