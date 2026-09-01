<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\Auth;
use App\Core\Database;

final class AuthController extends Controller
{
    public function login(): void { $this->view('auth/login', ['title' => 'Entrar no painel', 'guest' => true]); }
    public function authenticate(): void
    {
        $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
        $senha = $_POST['senha'] ?? '';
        if (!$email || strlen($senha) < 6) { $this->view('auth/login', ['title' => 'Entrar no painel', 'guest' => true, 'error' => 'Informe um e-mail válido e uma senha com pelo menos 6 caracteres.']); return; }
        try {
            $stmt = Database::connection()->prepare('SELECT id, nome, cargo, senha FROM usuarios WHERE email = :email LIMIT 1');
            $stmt->execute(['email' => $email]); $user = $stmt->fetch();
            if (!$user || !password_verify($senha, $user['senha'])) throw new \RuntimeException();
            Auth::login($user); $this->redirect('/pedidos');
        } catch (\Throwable) { $this->view('auth/login', ['title' => 'Entrar no painel', 'guest' => true, 'error' => 'Não foi possível entrar. Verifique suas credenciais.']); }
    }
}
