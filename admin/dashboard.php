<?php
session_start();
require_once '../includes/db.php';

// Verificar autenticação
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit;
}

// Buscar mensagens do banco de dados
try {
    $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    $messages = [];
    $error = "Erro ao carregar mensagens: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Silva777only</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background: #f5f5f5;
            color: #333;
        }
        
        .sidebar {
            width: 250px;
            background: #1a1a2e;
            color: white;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            padding: 20px;
        }
        
        .main-content {
            margin-left: 250px;
            padding: 20px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo h2 {
            color: #e94560;
            font-size: 22px;
        }
        
        .nav-menu {
            list-style: none;
        }
        
        .nav-menu li {
            margin-bottom: 10px;
        }
        
        .nav-menu a {
            color: #ccc;
            text-decoration: none;
            padding: 10px 15px;
            display: block;
            border-radius: 5px;
            transition: all 0.3s;
        }
        
        .nav-menu a:hover, .nav-menu a.active {
            background: #e94560;
            color: white;
        }
        
        .logout-btn {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
        }
        
        .logout-btn a {
            display: block;
            background: #e94560;
            color: white;
            text-align: center;
            padding: 12px;
            border-radius: 5px;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .logout-btn a:hover {
            background: #d43f57;
        }
        
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .stat-card h3 {
            color: #666;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
        }
        
        .stat-card .number {
            font-size: 36px;
            font-weight: bold;
            color: #1a1a2e;
        }
        
        .messages-table {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .message-content {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .btn {
            padding: 8px 15px;
            background: #e94560;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #d43f57;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <h2>Silva777only Admin</h2>
        </div>
        
        <ul class="nav-menu">
            <li><a href="#" class="active"><i class="fas fa-home"></i> Dashboard</a></li>
            <li><a href="#"><i class="fas fa-envelope"></i> Mensagens</a></li>
            <li><a href="#"><i class="fas fa-cog"></i> Configurações</a></li>
            <li><a href="#"><i class="fas fa-chart-bar"></i> Estatísticas</a></li>
        </ul>
        
        <div class="logout-btn">
            <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Sair</a>
        </div>
    </div>
    
    <div class="main-content">
        <div class="dashboard-header">
            <h1>Dashboard</h1>
            <div class="user-info">
                <span>Bem-vindo, Admin</span>
            </div>
        </div>
        
        <div class="stats-cards">
            <div class="stat-card">
                <h3>Total de Mensagens</h3>
                <div class="number"><?php echo count($messages); ?></div>
            </div>
            <div class="stat-card">
                <h3>IP Atual</h3>
                <div class="number" style="font-size: 18px;"><?php echo $_SERVER['REMOTE_ADDR']; ?></div>
            </div>
            <div class="stat-card">
                <h3>Status do Site</h3>
                <div class="number" style="color: #2ecc71; font-size: 24px;">Online</div>
            </div>
        </div>
        
        <div class="messages-table">
            <h2>Mensagens de Contato</h2>
            
            <?php if (isset($error)): ?>
                <div class="error" style="background: #fee; color: #c00; padding: 10px; margin: 10px 0; border-radius: 5px;">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Mensagem</th>
                        <th>IP</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($messages)): ?>
                        <tr>
                            <td colspan="7" style="text-align: center;">Nenhuma mensagem encontrada</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($messages as $message): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($message['id']); ?></td>
                                <td><?php echo htmlspecialchars($message['nome']); ?></td>
                                <td><?php echo htmlspecialchars($message['email']); ?></td>
                                <td class="message-content" title="<?php echo htmlspecialchars($message['mensagem']); ?>">
                                    <?php echo htmlspecialchars(substr($message['mensagem'], 0, 50)) . '...'; ?>
                                </td>
                                <td><?php echo htmlspecialchars($message['ip_address']); ?></td>
                                <td><?php echo date('d/m/Y H:i', strtotime($message['created_at'])); ?></td>
                                <td>
                                    <button class="btn">Ver</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
