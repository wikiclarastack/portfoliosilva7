<?php
session_start();
require_once 'includes/security.php';
require_once 'includes/header.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Silva777only - Portfólio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Estilos CSS inline para garantir funcionamento imediato */
        :root {
            --primary-color: #1a1a2e;
            --secondary-color: #16213e;
            --accent-color: #0f3460;
            --highlight-color: #e94560;
            --text-color: #f1f1f1;
            --light-bg: #2d3047;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: var(--primary-color);
            color: var(--text-color);
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
        }

        /* Header */
        header {
            background-color: rgba(22, 33, 62, 0.95);
            padding: 1rem 5%;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo h1 {
            font-size: 1.8rem;
            background: linear-gradient(90deg, #e94560, #4cc9f0);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        nav a:hover {
            background-color: var(--accent-color);
            color: white;
        }

        section {
            padding: 100px 5%;
            min-height: 100vh;
        }

        .hero {
            background: linear-gradient(rgba(26, 26, 46, 0.9), rgba(26, 26, 46, 0.9));
            text-align: center;
            padding-top: 150px;
        }

        .hero h2 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }

        .highlight {
            color: var(--highlight-color);
            font-weight: 700;
        }

        .btn {
            display: inline-block;
            background-color: var(--accent-color);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            margin-top: 20px;
        }

        .btn:hover {
            background-color: var(--highlight-color);
            transform: translateY(-2px);
        }

        .card-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .card {
            background-color: var(--secondary-color);
            border-radius: 10px;
            padding: 2rem;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
        }

        .admin-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
        }

        .admin-btn {
            background-color: var(--highlight-color);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
            transition: all 0.3s ease;
        }

        .admin-btn:hover {
            transform: scale(1.1);
        }

        footer {
            background-color: var(--secondary-color);
            padding: 3rem 5%;
            text-align: center;
            margin-top: 5rem;
        }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <section id="inicio" class="hero">
        <div class="hero-content">
            <h2>Olá, eu sou <span class="highlight">Silva777only</span></h2>
            <p>Desenvolvedor com mais de 5 anos de experiência em Lua e conhecimentos em HTML, JavaScript</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> São Paulo, SP - Zona Oeste</p>
            <div class="faith">
                <i class="fas fa-cross"></i> Amo Jesus Cristo, sou evangélico
            </div>
            <a href="#projetos" class="btn">Ver Meus Projetos</a>
        </div>
    </section>

    <section id="projetos">
        <h2 class="section-title">Meus Projetos</h2>
        <div class="card-container">
            <div class="card">
                <h3>Havana Roleplay</h3>
                <p>Jogo de roleplay no Roblox com comunidade ativa</p>
                <a href="https://www.roblox.com/pt/games/72358924525153/Havana-Roleplay" target="_blank" class="btn">Ver Projeto</a>
            </div>
            <div class="card">
                <h3>Last Owner</h3>
                <p>Projeto em desenvolvimento</p>
                <span class="status">Em Desenvolvimento</span>
            </div>
        </div>
    </section>

    <section id="sites">
        <h2 class="section-title">Sites que Desenvolvi</h2>
        <div class="card-container">
            <div class="card">
                <h3>ControlPrice</h3>
                <a href="https://controlprice.squareweb.app" target="_blank" class="btn">Visitar Site</a>
            </div>
            <div class="card">
                <h3>NexCorp</h3>
                <a href="https://nexcorp-henna.vercel.app" target="_blank" class="btn">Visitar Site</a>
            </div>
            <div class="card">
                <h3>WikiClaraStack</h3>
                <a href="https://wikiclarastack.github.io/wikiclarastack/" target="_blank" class="btn">Visitar Site</a>
            </div>
        </div>
    </section>

    <section id="habilidades">
        <h2 class="section-title">Minhas Habilidades</h2>
        <div class="skills-container">
            <div class="skill-item">
                <i class="fab fa-js"></i>
                <h3>JavaScript</h3>
                <p>Desenvolvimento front-end e back-end</p>
            </div>
            <div class="skill-item">
                <i class="fas fa-code"></i>
                <h3>HTML/CSS</h3>
                <p>Desenvolvimento web responsivo</p>
            </div>
            <div class="skill-item">
                <i class="fas fa-gamepad"></i>
                <h3>Lua (Roblox)</h3>
                <p>5+ anos de experiência</p>
            </div>
        </div>
    </section>

    <section id="sonhos">
        <h2 class="section-title">Meus Sonhos</h2>
        <div class="dreams-container">
            <div class="dream-card">
                <h3><i class="fas fa-flag-usa"></i> Morar nos EUA</h3>
                <p>Sonho em morar nos Estados Unidos e conhecer a Times Square em Nova York</p>
            </div>
            <div class="dream-card">
                <h3><i class="fas fa-running"></i> Marca Favorita</h3>
                <p>Sou fã da NIKE e admiro sua inovação em design e tecnologia esportiva</p>
            </div>
        </div>
    </section>

    <section id="contato">
        <h2 class="section-title">Entre em Contato</h2>
        <form action="contact.php" method="POST" class="contact-form">
            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" id="nome" name="nome" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn">Enviar Mensagem</button>
        </form>
    </section>

    <?php
    // Verificar se o IP atual tem acesso ao painel admin
    $user_ip = $_SERVER['REMOTE_ADDR'];
    $allowed_ip = '177.64.72.8';
    
    if ($user_ip === $allowed_ip) {
        echo '<div class="admin-panel">
                <a href="admin/" class="admin-btn" title="Painel Admin">
                    <i class="fas fa-lock"></i>
                </a>
              </div>';
    }
    ?>

    <footer>
        <div class="social-links">
            <a href="https://www.instagram.com/silva777only" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@_silva2k25_" target="_blank"><i class="fab fa-tiktok"></i></a>
            <a href="https://www.roblox.com/pt/users/8089172473/profile" target="_blank"><i class="fas fa-gamepad"></i></a>
        </div>
        <p>&copy; 2024 Silva777only. Todos os direitos reservados.</p>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>
