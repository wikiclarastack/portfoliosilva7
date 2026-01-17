<?php
session_start();
require_once '../includes/db.php';
require_once '../config/firebase-config.php';

// Verificação de IP
$user_ip = $_SERVER['REMOTE_ADDR'];
$allowed_ip = '177.64.72.8';

// Se não for o IP permitido, redirecionar
if ($user_ip !== $allowed_ip) {
    header('Location: ../index.php');
    exit;
}

// Se já estiver logado, redirecionar para dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

// Processar login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    
    if (!empty($email)) {
        // Aqui você implementaria a autenticação com Firebase
        // Por enquanto, vamos usar um sistema simples
        
        // Email do administrador (configure conforme necessário)
        $admin_email = 'admin@silva777only.com';
        
        if ($email === $admin_email) {
            // Enviar link de login por email (simulado)
            $_SESSION['login_pending'] = true;
            $_SESSION['login_email'] = $email;
            
            // Em um sistema real, você enviaria um email com o link de login
            // Aqui vamos simular o login
            $_SESSION['admin_logged_in'] = true;
            header('Location: dashboard.php');
            exit;
        } else {
            $error = "Email não autorizado";
        }
    } else {
        $error = "Por favor, informe um email válido";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Silva777only</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            color: #ccc;
            margin-bottom: 8px;
        }
        
        input[type="email"] {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 16px;
        }
        
        input[type="email"]:focus {
            outline: none;
            border-color: #e94560;
        }
        
        button {
            width: 100%;
            padding: 12px;
            background: #e94560;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        button:hover {
            background: #d43f57;
        }
        
        .error {
            background: rgba(231, 76, 60, 0.2);
            border: 1px solid #e74c3c;
            color: #e74c3c;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .ip-info {
            background: rgba(52, 152, 219, 0.2);
            border: 1px solid #3498db;
            color: #3498db;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Painel Administrativo</h1>
        
        <div class="ip-info">
            IP Detectado: <?php echo htmlspecialchars($user_ip); ?>
        </div>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="email">Email de Administrador</label>
                <input type="email" id="email" name="email" required placeholder="seu@email.com">
            </div>
            
            <button type="submit">Enviar Link de Login</button>
        </form>
        
        <p style="color: #aaa; text-align: center; margin-top: 20px; font-size: 12px;">
            Um link de login será enviado para seu email
        </p>
    </div>
</body>
</html>
