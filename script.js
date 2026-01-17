// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC7Ju7jbG6uajkk37yFA0sQrdMAh3IImjU",
  authDomain: "futurosilvabueno.firebaseapp.com",
  databaseURL: "https://futurosilvabueno-default-rtdb.firebaseio.com",
  projectId: "futurosilvabueno",
  storageBucket: "futurosilvabueno.firebasestorage.app",
  messagingSenderId: "199552031137",
  appId: "1:199552031137:web:73c4c70a8c83777f1ed3e0",
  measurementId: "G-K114RJE3KQ"
};

// Configuração da API Gemini
const GEMINI_API_KEY = "AIzaSyDwune_xKlYs6kSryldSTD6FdB9IhX7IZ4";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Elementos da DOM
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authMessage = document.getElementById('auth-message');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
const friendEmailInput = document.getElementById('friend-email');
const addFriendBtn = document.getElementById('add-friend-btn');
const friendsList = document.querySelector('.friends-list');
const goalTitleInput = document.getElementById('goal-title');
const goalDescriptionInput = document.getElementById('goal-description');
const goalValueInput = document.getElementById('goal-value');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalsList = document.querySelector('.goals-list');
const chatInput = document.getElementById('chat-input');
const sendMessageBtn = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const toggleChatBtn = document.getElementById('toggle-chat');
const chatBody = document.querySelector('.chat-body');
const aiHelpBtn = document.getElementById('ai-help-btn');
const aiModal = document.getElementById('ai-modal');
const closeModalBtn = document.getElementById('close-modal');

// Estado da aplicação
let currentUser = null;
let friends = [];
let goals = [];
let chatOpen = true;

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há usuário logado
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            userName.textContent = user.email.split('@')[0];
            authContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            loadUserData();
            loadFriends();
            loadGoals();
            loadChatMessages();
        } else {
            currentUser = null;
            authContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
        }
    });

    // Event listeners
    loginBtn.addEventListener('click', login);
    registerBtn.addEventListener('click', register);
    logoutBtn.addEventListener('click', logout);
    addFriendBtn.addEventListener('click', addFriend);
    addGoalBtn.addEventListener('click', addGoal);
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    toggleChatBtn.addEventListener('click', toggleChat);
    aiHelpBtn.addEventListener('click', () => aiModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => aiModal.classList.add('hidden'));
    
    // Fechar modal ao clicar fora
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            aiModal.classList.add('hidden');
        }
    });
});

// Funções de autenticação
function login() {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        showAuthMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showAuthMessage('Login realizado com sucesso!', 'success');
        })
        .catch(error => {
            console.error('Erro no login:', error);
            showAuthMessage('Erro ao fazer login: ' + error.message, 'error');
        });
}

function register() {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        showAuthMessage('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            showAuthMessage('Conta criada com sucesso!', 'success');
            // Salvar dados iniciais do usuário
            saveUserData(email);
        })
        .catch(error => {
            console.error('Erro no cadastro:', error);
            showAuthMessage('Erro ao criar conta: ' + error.message, 'error');
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            console.log('Usuário deslogado');
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
        });
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = 'auth-message';
    authMessage.classList.add(type);
}

// Funções de dados do usuário
function saveUserData(email) {
    const userId = auth.currentUser.uid;
    const userData = {
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        friends: [],
        goals: []
    };
    
    database.ref('users/' + userId).set(userData)
        .then(() => {
            console.log('Dados do usuário salvos');
        })
        .catch(error => {
            console.error('Erro ao salvar dados do usuário:', error);
        });
}

function loadUserData() {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    database.ref('users/' + userId).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                userName.textContent = userData.name || userData.email.split('@')[0];
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados do usuário:', error);
        });
}

// Funções de amigos
function addFriend() {
    const friendEmail = friendEmailInput.value.trim();
    
    if (!friendEmail) {
        alert('Por favor, digite o email do amigo');
        return;
    }
    
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    
    // Verificar se o amigo já está na lista
    database.ref('users').orderByChild('email').equalTo(friendEmail).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                // Adicionar amigo à lista do usuário atual
                const friendKey = Object.keys(snapshot.val())[0];
                const friendData = snapshot.val()[friendKey];
                
                database.ref('users/' + userId + '/friends/' + friendKey).set({
                    email: friendEmail,
                    name: friendData.name || friendEmail.split('@')[0],
                    addedAt: new Date().toISOString()
                });
                
                // Adicionar o usuário atual à lista de amigos do amigo
                database.ref('users/' + friendKey + '/friends/' + userId).set({
                    email: currentUser.email,
                    name: currentUser.email.split('@')[0],
                    addedAt: new Date().toISOString()
                });
                
                friendEmailInput.value = '';
                alert('Amigo adicionado com sucesso!');
                loadFriends();
            } else {
                alert('Usuário não encontrado. Verifique o email digitado.');
            }
        })
        .catch(error => {
            console.error('Erro ao adicionar amigo:', error);
            alert('Erro ao adicionar amigo: ' + error.message);
        });
}

function loadFriends() {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    
    database.ref('users/' + userId + '/friends').once('value')
        .then(snapshot => {
            friendsList.innerHTML = '';
            
            // Amigos padrão (Silva e Bueno)
            const defaultFriends = [
                {
                    name: 'Silva',
                    email: 'silva@exemplo.com',
                    age: 17,
                    favCountry: 'EUA',
                    status: 'online'
                },
                {
                    name: 'Bueno',
                    email: 'bueno@exemplo.com',
                    age: 16,
                    favCountry: 'ING',
                    status: 'online'
                }
            ];
            
            // Adicionar amigos padrão
            defaultFriends.forEach(friend => {
                const friendCard = createFriendCard(friend);
                friendsList.appendChild(friendCard);
            });
            
            // Adicionar amigos do banco de dados
            if (snapshot.exists()) {
                const friendsData = snapshot.val();
                Object.values(friendsData).forEach(friend => {
                    const friendCard = createFriendCard(friend);
                    friendsList.appendChild(friendCard);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar amigos:', error);
        });
}

function createFriendCard(friend) {
    const friendCard = document.createElement('div');
    friendCard.className = 'friend-card';
    
    friendCard.innerHTML = `
        <div class="friend-avatar"><i class="fas fa-user"></i></div>
        <div class="friend-info">
            <h3>${friend.name}</h3>
            <p>${friend.age ? `Idade: ${friend.age} • ` : ''}País favorito: ${friend.favCountry || 'Não informado'}</p>
            <span class="status ${friend.status || 'online'}">${friend.status === 'online' ? 'Online' : 'Offline'}</span>
        </div>
    `;
    
    return friendCard;
}

// Funções de metas
function addGoal() {
    const title = goalTitleInput.value.trim();
    const description = goalDescriptionInput.value.trim();
    const value = parseFloat(goalValueInput.value);
    
    if (!title || !description || isNaN(value) || value <= 0) {
        alert('Por favor, preencha todos os campos corretamente');
        return;
    }
    
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    const goalId = Date.now().toString();
    
    const goalData = {
        id: goalId,
        title: title,
        description: description,
        value: value,
        currentValue: 0,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        contributors: [userId]
    };
    
    database.ref('goals/' + goalId).set(goalData)
        .then(() => {
            // Adicionar meta à lista do usuário
            database.ref('users/' + userId + '/goals/' + goalId).set(true);
            
            goalTitleInput.value = '';
            goalDescriptionInput.value = '';
            goalValueInput.value = '';
            
            loadGoals();
        })
        .catch(error => {
            console.error('Erro ao adicionar meta:', error);
            alert('Erro ao adicionar meta: ' + error.message);
        });
}

function loadGoals() {
    if (!currentUser) return;
    
    goalsList.innerHTML = '';
    
    database.ref('goals').once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const goalsData = snapshot.val();
                
                Object.values(goalsData).forEach(goal => {
                    const goalCard = createGoalCard(goal);
                    goalsList.appendChild(goalCard);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar metas:', error);
        });
}

function createGoalCard(goal) {
    const goalCard = document.createElement('div');
    goalCard.className = 'goal-card';
    
    const progress = (goal.currentValue / goal.value) * 100;
    
    goalCard.innerHTML = `
        <div class="goal-header">
            <h3>${goal.title}</h3>
            <span class="goal-value">R$ ${goal.value.toFixed(2)}</span>
        </div>
        <p class="goal-description">${goal.description}</p>
        <div class="goal-progress">
            <div class="progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="goal-actions">
            <div class="goal-contributors">
                ${goal.contributors && goal.contributors.length > 0 ? 
                    `<div class="contributor"><i class="fas fa-user"></i></div>` : 
                    '<span>Sem contribuidores</span>'}
            </div>
            <button class="btn-primary btn-small" onclick="contributeToGoal('${goal.id}')">Contribuir</button>
        </div>
    `;
    
    return goalCard;
}

// Função para contribuir para meta
function contributeToGoal(goalId) {
    const amount = prompt('Quanto você deseja contribuir? (R$)');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Por favor, insira um valor válido');
        return;
    }
    
    database.ref('goals/' + goalId + '/currentValue').transaction(current => {
        return (current || 0) + parseFloat(amount);
    }).then(() => {
        loadGoals();
        addMessageToChat('system', `Contribuição de R$ ${amount} adicionada à meta!`);
    });
}

// Funções de chat e IA
function sendMessage() {
    const messageText = chatInput.value.trim();
    
    if (!messageText || !currentUser) return;
    
    // Verificar se é um comando para a IA
    const isAICommand = messageText.toLowerCase().includes('@ia') || 
                       messageText.toLowerCase().includes('ia') ||
                       messageText.toLowerCase().includes('assistente');
    
    // Enviar mensagem normal
    const messageId = Date.now().toString();
    const messageData = {
        id: messageId,
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.email.split('@')[0],
        timestamp: new Date().toISOString(),
        isAI: false
    };
    
    database.ref('messages/' + messageId).set(messageData)
        .then(() => {
            chatInput.value = '';
            
            // Se for comando para IA, processar
            if (isAICommand) {
                processAICommand(messageText);
            }
            
            // Rolar para a última mensagem
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
        });
}

function processAICommand(messageText) {
    // Mostrar indicador de que a IA está pensando
    const thinkingId = 'thinking-' + Date.now();
    const thinkingMessage = {
        id: thinkingId,
        text: "Analisando sua pergunta...",
        senderName: "Assistente de Viagem IA",
        timestamp: new Date().toISOString(),
        isAI: true,
        isThinking: true
    };
    
    addMessageElement(thinkingMessage);
    
    // Preparar contexto para a IA
    const context = criarContextoParaIA();
    const prompt = criarPromptParaIA(messageText, context);
    
    // Chamar API do Gemini
    fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remover mensagem de "pensando"
        const thinkingElement = document.querySelector(`[data-id="${thinkingId}"]`);
        if (thinkingElement) {
            thinkingElement.remove();
        }
        
        // Processar resposta da IA
        let aiResponse = "Desculpe, não consegui processar sua solicitação.";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiResponse = data.candidates[0].content.parts[0].text;
        }
        
        // Salvar resposta da IA no chat
        const aiMessageId = Date.now().toString();
        const aiMessageData = {
            id: aiMessageId,
            text: aiResponse,
            senderName: "Assistente de Viagem IA",
            timestamp: new Date().toISOString(),
            isAI: true
        };
        
        database.ref('messages/' + aiMessageId).set(aiMessageData);
        
        // Verificar se a resposta contém ação específica
        processarRespostaDaIA(aiResponse);
    })
    .catch(error => {
        console.error('Erro ao chamar API Gemini:', error);
        
        // Remover mensagem de "pensando"
        const thinkingElement = document.querySelector(`[data-id="${thinkingId}"]`);
        if (thinkingElement) {
            thinkingElement.remove();
        }
        
        // Mensagem de fallback
        const fallbackMessage = {
            id: 'fallback-' + Date.now(),
            text: "Não consegui me conectar ao servidor da IA. Aqui está uma análise básica:\n\n" + 
                  gerarRespostaFallback(messageText),
            senderName: "Assistente de Viagem IA",
            timestamp: new Date().toISOString(),
            isAI: true
        };
        
        addMessageElement(fallbackMessage);
    });
}

function criarContextoParaIA() {
    return {
        usuarios: {
            Silva: { idade: 17, pais_favorito: "EUA" },
            Bueno: { idade: 16, pais_favorito: "ING" }
        },
        plano: "Texas (2 anos) → Europa (2 anos) → Nova York (se possível)",
        comparacao_paises: {
            EUA: {
                cidade: "Texas",
                salario_2pessoas: 6200,
                alimentacao: { min: 570, max: 780 },
                moradia: 2000,
                transporte_carro: 300,
                saude: 500,
                comunicacao: 215,
                sobra: 2500,
                vantagens: "Dólar valorizado, poder de compra maior, mercado barato"
            },
            ING: {
                cidade: "Leicester",
                salario_2pessoas: 3800,
                alimentacao: { min: 300, max: 400 },
                moradia: 899,
                transporte_carro: 30,
                saude: 0,
                comunicacao: 65,
                sobra: 2300,
                vantagens: "Saúde gratuita, possibilidade de turismo"
            }
        },
        metas: goals
    };
}

function criarPromptParaIA(mensagemUsuario, contexto) {
    return `Você é um assistente especializado em planejamento de viagens e moradia no exterior.
    
CONTEXTO DO PLANO:
- Usuários: Silva (17 anos, prefere EUA) e Bueno (16 anos, prefere Inglaterra)
- Plano: 2 anos no Texas → 2 anos na Europa → possivelmente Nova York permanentemente
- Dados financeiros disponíveis na interface

DADOS FINANCEIROS:
EUA (Texas):
• Salário líquido (2 pessoas): $6.200/mês
• Alimentação: $570-780
• Moradia: $2.000
• Transporte (carro): $300
• Saúde: $500
• Comunicação: $215
• Sobra mensal: $2.500

ING (Leicester):
• Salário líquido (2 pessoas): £3.800/mês
• Alimentação: £300-400
• Moradia: £899
• Transporte (carro): £30
• Saúde: £0
• Comunicação: £65
• Sobra mensal: £2.300

METAS ATUAIS: ${contexto.metas.length > 0 ? JSON.stringify(contexto.metas.map(m => ({titulo: m.title, valor: m.value, atual: m.currentValue}))) : 'Nenhuma meta cadastrada ainda'}

INSTRUÇÕES:
1. Responda em português brasileiro, de forma clara e amigável
2. Use emojis quando apropriado para deixar a resposta mais amigável
3. Se a pergunta for sobre cálculos, mostre o passo a passo
4. Se for sobre comparação entre países, seja imparcial e baseie-se nos dados
5. Se for sobre o plano Texas→Europa→NY, dê conselhos práticos
6. Se o usuário pedir para criar uma meta, sugira valores realistas baseados nos dados

PERGUNTA DO USUÁRIO: "${mensagemUsuario}"

RESPONDA DE FORMA ÚTIL E PRÁTICA, CONSIDERANDO O CONTEXTO ACIMA:`;
}

function gerarRespostaFallback(mensagemUsuario) {
    const lowerMessage = mensagemUsuario.toLowerCase();
    
    if (lowerMessage.includes('calcular') || lowerMessage.includes('quanto tempo') || lowerMessage.includes('economia')) {
        return `Para calcular economia para o plano Texas→Europa→NY:
        
💰 **Cálculo de Economia:**
• Sobra mensal no Texas: $2.500 ≈ R$ 12.500
• Para juntar R$ 100.000: 100.000 ÷ 12.500 = 8 meses
• Recomendação: Estabeleça metas menores primeiro (passagens, documentação)`;

    } else if (lowerMessage.includes('comparar') || lowerMessage.includes('país') || lowerMessage.includes('qual melhor')) {
        return `📊 **Comparação EUA vs Inglaterra:**

🇺🇸 **Texas (EUA):**
• Vantagem: Maior poder de compra ($2.500 sobra)
• Desvantagem: Custo de saúde alto ($500)
• Ideal para: Acumular capital rapidamente

🇬🇧 **Leicester (ING):**
• Vantagem: Saúde gratuita, fácil turismo pela Europa
• Desvantagem: Poder de compra menor
• Ideal para: Experiência cultural

🎯 **Recomendação:** Comecem no Texas para juntar capital, depois Europa para experiência.`;

    } else if (lowerMessage.includes('meta') || lowerMessage.includes('economizar') || lowerMessage.includes('juntar')) {
        return `🎯 **Sugestões de Metas:**

1. **Meta Imediata:** R$ 15.000 para documentação e vistos
2. **Meta Curto Prazo:** R$ 40.000 para passagens e primeiros meses
3. **Meta Texas (2 anos):** R$ 300.000 para estabilidade inicial
4. **Meta Europa (2 anos):** R$ 200.000 para transição

💡 **Dica:** No Texas, podem juntar aproximadamente R$ 150.000 por ano (12 × R$ 12.500).`;

    } else if (lowerMessage.includes('documento') || lowerMessage.includes('visto')) {
        return `📋 **Documentação Necessária:**

🇺🇸 **Para EUA:**
• Visto de trabalho (H-1B ou L-1)
• Passaporte válido
• Comprovante de renda
• Histórico bancário
• Seguro saúde

🇬🇧 **Para Inglaterra:**
• Visto Skilled Worker
• Oferta de emprego
• Comprovante de conhecimento de inglês
• Recursos financeiros

⏰ **Processo:** Comecem a documentação pelo menos 1 ano antes!`;

    } else {
        return `Sou seu assistente de viagem! Posso ajudar com:
• 📊 Comparação entre países (EUA vs Inglaterra)
• 💰 Cálculos de economia e tempo
• 🎯 Sugestões de metas financeiras
• 📋 Documentação necessária
• 🗺️ Planejamento do roteiro Texas→Europa→NY

Como posso ajudar especificamente?`;
    }
}

function processarRespostaDaIA(resposta) {
    // Verificar se a resposta contém sugestão de meta
    if (resposta.toLowerCase().includes('meta') && 
        (resposta.includes('R$') || resposta.includes('reais') || resposta.includes('valor'))) {
        
        // Extrair valores de meta da resposta
        const valorRegex = /R\$\s*([\d.,]+)/g;
        const tituloRegex = /Meta.*?:/g;
        
        // Tentar extrair informações para criar meta automaticamente
        const linhas = resposta.split('\n');
        linhas.forEach(linha => {
            if (linha.includes('R$') && (linha.includes('Meta') || linha.includes('para'))) {
                console.log('Possível meta detectada:', linha);
                // Aqui poderia-se implementar criação automática de meta
            }
        });
    }
}

function loadChatMessages() {
    database.ref('messages').limitToLast(20).on('value', snapshot => {
        chatMessages.innerHTML = '';
        
        if (snapshot.exists()) {
            const messagesData = snapshot.val();
            const messagesArray = Object.values(messagesData);
            
            // Ordenar por timestamp
            messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            messagesArray.forEach(message => {
                addMessageElement(message);
            });
            
            // Rolar para a última mensagem
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    });
}

function addMessageElement(message) {
    const messageDiv = document.createElement('div');
    const isCurrentUser = currentUser && message.senderId === currentUser.uid;
    const isAI = message.isAI;
    
    messageDiv.className = `message ${isCurrentUser ? 'sent' : isAI ? 'ai' : 'received'} ${message.isThinking ? 'thinking' : ''}`;
    messageDiv.setAttribute('data-id', message.id);
    
    const time = new Date(message.timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">${message.senderName} • ${time}</div>
        <div class="message-text">${message.text}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Rolar para a nova mensagem
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

function toggleChat() {
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatBody.style.display = 'flex';
        toggleChatBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        chatBody.style.display = 'none';
        toggleChatBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// Função auxiliar para adicionar mensagem ao chat
function addMessageToChat(sender, text) {
    const messageId = Date.now().toString();
    const messageData = {
        id: messageId,
        text: text,
        senderName: sender,
        timestamp: new Date().toISOString(),
        isAI: sender === 'system' || sender === 'Assistente de Viagem IA'
    };
    
    database.ref('messages/' + messageId).set(messageData);
}
