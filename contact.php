<?php
session_start();
require_once 'includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_STRING);
    $ip_address = $_SERVER['REMOTE_ADDR'];
    
    // Validar dados
    if (empty($nome) || empty($email) || empty($mensagem)) {
        $_SESSION['contact_error'] = 'Por favor, preencha todos os campos.';
        header('Location: index.php#contato');
        exit;
    }
    
    // Inserir no banco de dados
    try {
        $stmt = $pdo->prepare("INSERT INTO messages (nome, email, mensagem, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $email, $mensagem, $ip_address]);
        
        // Enviar para webhook (simulado - você deve configurar seu webhook real)
        $webhook_url = 'https://discord.com/api/webhooks/1453640058484822087/YgHaWqGzsQ5RMEdgvsYdiFX7yCAe95RN5_oCLayDxOFHgdFgR2j9Uy5V66PTkCXVbnMs';
        $webhook_data = [
            'content' => "📧 Nova mensagem de contato!\n**Nome:** $nome\n**Email:** $email\n**Mensagem:** $mensagem\n**IP:** $ip_address"
        ];
        
        // Enviar para webhook (comentado por enquanto)
        /*
        $ch = curl_init($webhook_url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
        */
        
        $_SESSION['contact_success'] = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
        header('Location: index.php#contato');
        exit;
        
    } catch(PDOException $e) {
        $_SESSION['contact_error'] = 'Erro ao enviar mensagem. Tente novamente.';
        header('Location: index.php#contato');
        exit;
    }
} else {
    header('Location: index.php');
    exit;
}
?>
