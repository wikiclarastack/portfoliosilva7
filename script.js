import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFarkcZ4W8lk-GybNyk4Fp4RMMl7cz6Gc",
  authDomain: "silvaportfolio-6766a.firebaseapp.com",
  databaseURL: "https://silvaportfolio-6766a-default-rtdb.firebaseio.com",
  projectId: "silvaportfolio-6766a",
  storageBucket: "silvaportfolio-6766a.firebasestorage.app",
  messagingSenderId: "166925374205",
  appId: "1:166925374205:web:973f9cbf9dced650b16494"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== SUPORTE =====
window.sendTicket = () => {
  const email = ticketEmail.value;
  const reason = ticketReason.value;
  const msg = ticketMsg.value;

  if (!email || !msg) {
    ticketStatus.innerText = "Preencha tudo.";
    return;
  }

  push(ref(db, "tickets"), {
    email,
    reason,
    msg,
    date: new Date().toISOString()
  });

  ticketStatus.innerText = "Ticket enviado com sucesso!";
};

// ===== ADMIN =====
window.adminLogin = () => {
  const email = adminEmail.value;
  adminStatus.innerText =
    email === "guizinbzsk@gmail.com"
      ? "Admin autenticado"
      : "Acesso negado (invasor)";
};

// ===== IDIOMAS =====
window.setLang = (lang) => {
  alert(lang === "pt" ? "Português ativo" : "English active");
};
