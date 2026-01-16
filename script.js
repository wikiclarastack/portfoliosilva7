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
const ticketForm = document.getElementById('ticketForm');
const formMessage = document.getElementById('formMessage');
const loginBtn = document.getElementById('loginBtn');
const ticketList = document.getElementById('ticketList');
const ticketsContainer = document.getElementById('ticketsContainer');

// Admin credentials (em um cenário real, isso seria gerenciado com autenticação Firebase)
const ADMIN_EMAIL = "silva777only@admin.com";
const ADMIN_PASSWORD = "admin123"; // Em produção, usar autenticação Firebase

// Menu móvel
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Função para mostrar mensagens no formulário
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.display = 'block';
    formMessage.style.color = type === 'success' ? '#2ecc71' : '#e94560';
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Envio do formulário de contato
ticketForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const reason = document.getElementById('reason').value;
    const message = document.getElementById('message').value;
    
    // Validar campos
    if (!name || !email || !reason || !message) {
        showFormMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Criar ticket
    const ticket = {
        name: name,
        email: email,
        reason: reason,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Salvar no Firebase
    const ticketsRef = database.ref('tickets');
    const newTicketRef = ticketsRef.push();
    
    newTicketRef.set(ticket)
        .then(() => {
            // Limpar formulário
            ticketForm.reset();
            showFormMessage('Ticket enviado com sucesso! Entrarei em contato em breve.', 'success');
            
            // Se o painel admin estiver visível, atualizar a lista
            if (ticketList.style.display === 'block') {
                loadTickets();
            }
        })
        .catch((error) => {
            console.error('Erro ao enviar ticket:', error);
            showFormMessage('Erro ao enviar ticket. Tente novamente.', 'error');
        });
});

// Login do painel administrativo
loginBtn.addEventListener('click', () => {
    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;
    
    // Verificar credenciais
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
        // Mostrar painel de tickets
        ticketList.style.display = 'block';
        loginBtn.textContent = 'Painel Carregado';
        loginBtn.style.backgroundColor = '#2ecc71';
        
        // Carregar tickets
        loadTickets();
    } else {
        alert('Acesso negado! Credenciais inválidas.');
    }
});

// Carregar tickets do Firebase
function loadTickets() {
    const ticketsRef = database.ref('tickets');
    
    ticketsRef.on('value', (snapshot) => {
        ticketsContainer.innerHTML = '';
        
        if (!snapshot.exists()) {
            ticketsContainer.innerHTML = '<p>Nenhum ticket encontrado.</p>';
            return;
        }
        
        const tickets = snapshot.val();
        let ticketCount = 0;
        
        // Ordenar tickets por timestamp (mais recentes primeiro)
        const sortedTickets = Object.entries(tickets).sort((a, b) => {
            return new Date(b[1].timestamp) - new Date(a[1].timestamp);
        });
        
        sortedTickets.forEach(([key, ticket]) => {
            ticketCount++;
            const ticketItem = document.createElement('div');
            ticketItem.className = 'ticket-item';
            
            // Formatar data
            const date = new Date(ticket.timestamp);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            ticketItem.innerHTML = `
                <div class="ticket-header">
                    <div class="ticket-name">${ticket.name}</div>
                    <div class="ticket-reason">${ticket.reason}</div>
                </div>
                <div class="ticket-email">${ticket.email} • ${formattedDate}</div>
                <div class="ticket-message">${ticket.message}</div>
            `;
            
            ticketsContainer.appendChild(ticketItem);
        });
        
        // Atualizar contador
        const ticketListTitle = ticketList.querySelector('h4');
        ticketListTitle.textContent = `Tickets Recebidos (${ticketCount})`;
    });
}

// Adicionar efeitos de animação ao rolar a página
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const nav = document.querySelector('header');
    
    // Mudar background do header ao rolar
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(26, 26, 46, 0.98)';
        nav.style.backdropFilter = 'blur(15px)';
    } else {
        nav.style.backgroundColor = 'rgba(26, 26, 46, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    }
    
    // Animar elementos quando entram na tela
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            const animatedElements = section.querySelectorAll('.animated, .slide-left, .slide-right');
            animatedElements.forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
    });
});

// Inicializar animações quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe animada aos elementos iniciais
    const heroElements = document.querySelectorAll('.hero .animated, .hero .slide-left, .hero .slide-right');
    heroElements.forEach(element => {
        element.style.animationPlayState = 'running';
    });
});
