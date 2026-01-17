// /api/contact.js
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;

            // Validate input
            if (!name || !email || !message) {
                return res.status(400).json({ 
                    error: 'Todos os campos são obrigatórios' 
                });
            }

            // Webhook URL (store this in environment variables in production)
            const webhookURL = process.env.DISCORD_WEBHOOK_URL || 
                             'https://discord.com/api/webhooks/your-webhook-url';

            // Create embed for Discord
            const discordEmbed = {
                title: '📧 Novo Contato - Portfolio Silva777only',
                color: 0x00ff00,
                fields: [
                    {
                        name: '👤 Nome',
                        value: name,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: email,
                        inline: true
                    },
                    {
                        name: '💬 Mensagem',
                        value: message.length > 1000 ? message.substring(0, 1000) + '...' : message
                    },
                    {
                        name: '🕐 Data/Hora',
                        value: new Date().toLocaleString('pt-BR'),
                        inline: true
                    },
                    {
                        name: '🌐 IP',
                        value: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Silva777only Portfolio'
                }
            };

            // Send to Discord webhook
            const discordResponse = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [discordEmbed],
                    username: 'Portfolio Contact Bot',
                    avatar_url: 'https://cdn.discordapp.com/avatars/your-bot-avatar.png'
                })
            });

            if (!discordResponse.ok) {
                console.error('Discord webhook failed:', await discordResponse.text());
            }

            // You could also save to a database here
            // Example: await saveToDatabase({ name, email, message, ip, timestamp });

            return res.status(200).json({ 
                success: true, 
                message: 'Mensagem enviada com sucesso!' 
            });

        } catch (error) {
            console.error('Contact form error:', error);
            return res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Método não permitido' });
}
