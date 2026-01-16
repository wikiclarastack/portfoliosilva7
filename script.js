// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFarkcZ4W8lk-GybNyk4Fp4RMMl7cz6Gc",
    authDomain: "silvaportfolio-6766a.firebaseapp.com",
    databaseURL: "https://silvaportfolio-6766a-default-rtdb.firebaseio.com",
    projectId: "silvaportfolio-6766a",
    storageBucket: "silvaportfolio-6766a.firebasestorage.app",
    messagingSenderId: "166925374205",
    appId: "1:166925374205:web:973f9cbf9dced650b16494",
    measurementId: "G-3HKSFRFVET"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elementos DOM
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const loginBtn = document.getElementById('loginBtn');
const ticketPanel = document.getElementById('ticketPanel');
const ticketsList = document.getElementById('ticketsList');

// Menu Mobile
mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (window.innerWidth <= 768) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.right = '20px';
        navLinks.style.background = 'var(--secondary)';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '10px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        navLinks.style.gap = '1rem';
    }
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Formulário de Contato
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const ticket = {
            name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
            email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
            reason: contactForm.querySelector('select').value,
            message: contactForm.querySelector('textarea').value,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        
        try {
            const ticketsRef = database.ref('tickets');
            await ticketsRef.push(ticket);
            
            alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            contactForm.reset();
            
            // Atualizar lista de tickets se o painel estiver visível
            if (!ticketPanel.classList.contains('hidden')) {
                loadTickets();
            }
        } catch (error) {
            console.error('Erro ao enviar ticket:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        }
    });
}

// Login Admin
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const adminEmail = document.getElementById('adminEmail').value;
        const adminPassword = document.getElementById('adminPassword').value;
        
        // Credenciais simples (em produção usar Firebase Auth)
        if (adminEmail === 'silva777only@admin.com' && adminPassword === 'admin123') {
            ticketPanel.classList.remove('hidden');
            loginBtn.textContent = 'Painel Carregado';
            loginBtn.disabled = true;
            loadTickets();
        } else {
            alert('Acesso negado! Credenciais inválidas.');
        }
    });
}

// Carregar Tickets
async function loadTickets() {
    try {
        const ticketsRef = database.ref('tickets');
        const snapshot = await ticketsRef.once('value');
        
        ticketsList.innerHTML = '';
        
        if (!snapshot.exists()) {
            ticketsList.innerHTML = '<p class="text-center">Nenhum ticket encontrado.</p>';
            return;
        }
        
        const tickets = [];
        snapshot.forEach(childSnapshot => {
            tickets.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        
        // Ordenar por data (mais recente primeiro)
        tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket';
            
            const date = new Date(ticket.timestamp);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            ticketElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong>${ticket.name}</strong>
                    <span style="background: var(--accent); padding: 3px 10px; border-radius: 20px; font-size: 0.8rem;">${ticket.reason}</span>
                </div>
                <div style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 10px;">${ticket.email} • ${formattedDate}</div>
                <div>${ticket.message}</div>
            `;
            
            ticketsList.appendChild(ticketElement);
        });
    } catch (error) {
        console.error('Erro ao carregar tickets:', error);
        ticketsList.innerHTML = '<p class="text-center" style="color: var(--highlight);">Erro ao carregar tickets.</p>';
    }
}

// Animação de números nas estatísticas
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (target > 1000 ? '+' : '');
    }, 30);
}

// Iniciar animações quando a seção de estatísticas estiver visível
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = document.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    observer.observe(statsSection);
}

// Efeito de digitação no título principal
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
    
    // Iniciar após 1 segundo
    setTimeout(typeWriter, 1000);
}

// Adicionar efeito hover aos cards
document.querySelectorAll('.project-card, .website-card, .social-card, .favorite-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

// Header com blur ao rolar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 15, 30, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(15, 15, 30, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfólio Silva777only carregado!');
});
