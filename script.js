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

window.openTicket = () => {
  document.getElementById("ticketModal").classList.add("active");
};

window.enviarTicket = () => {
  const email = document.getElementById("email").value;
  const motivo = document.getElementById("motivo").value;
  const mensagem = document.getElementById("mensagem").value;

  if (!email || !motivo || !mensagem) {
    alert("Preencha todos os campos");
    return;
  }

  push(ref(db, "tickets"), {
    email,
    motivo,
    mensagem,
    data: new Date().toISOString()
  });

  alert("Ticket enviado com sucesso!");
  document.getElementById("ticketModal").classList.remove("active");
};
