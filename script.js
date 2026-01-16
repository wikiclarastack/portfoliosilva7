// Adicionar ao final do arquivo script.js, antes do fechamento

// Animação para contar números nas estatísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

// Verificar quando a seção de estatísticas entra na tela
const statsSection = document.getElementById('stats');
let statsAnimated = false;

// Função para verificar visibilidade das seções
function checkVisibility() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            // Animar estatísticas apenas uma vez
            if (section.id === 'stats' && !statsAnimated) {
                statsAnimated = true;
                setTimeout(animateStats, 300);
            }
            
            // Animar barras de habilidades
            if (section.id === 'favorites') {
                const skillLevels = document.querySelectorAll('.skill-level');
                skillLevels.forEach(level => {
                    const width = level.style.width;
                    level.style.width = '0';
                    setTimeout(() => {
                        level.style.width = width;
                    }, 300);
                });
            }
        }
    });
}

// Adicionar evento de scroll para verificar visibilidade
window.addEventListener('scroll', () => {
    // Código anterior...
    
    // Verificar visibilidade das seções
    checkVisibility();
});

// Inicializar verificação de visibilidade quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Código anterior...
    
    // Verificar visibilidade inicial
    checkVisibility();
    
    // Adicionar efeito de digitação no título principal
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Adicionar efeito de parallax nas imagens
    const heroImage = document.querySelector('.hero-image img');
    window.addEventListener('scroll', () => {
        if (heroImage) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Adicionar interatividade aos cards
    const cards = document.querySelectorAll('.project-card, .social-card, .favorite-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Sistema de notificações para novos tickets (simulação)
    function simulateNewTicketNotification() {
        // Apenas para demonstração - em produção isso viria do Firebase
        if (Math.random() > 0.7) {
            showNotification('Novo ticket recebido!');
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--highlight);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Simular notificações periódicas (apenas para demonstração)
    // setInterval(simulateNewTicketNotification, 15000);
});
