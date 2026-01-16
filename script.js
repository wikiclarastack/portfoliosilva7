// 🔥 FIREBASE CONFIG (COLOQUE SUA KEY AQUI)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// 🔐 LOGIN
function openLogin() {
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLogin() {
  document.getElementById("loginModal").classList.add("hidden");
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logado com sucesso");
      closeLogin();
    })
    .catch(err => alert(err.message));
}

// 🎟️ TICKET
function openTicket() {
  document.getElementById("support").scrollIntoView({ behavior: "smooth" });
  document.getElementById("ticketBox").classList.remove("hidden");
}

function sendTicket() {
  const text = document.querySelector("textarea").value;

  db.collection("tickets").add({
    message: text,
    email: "guizinbzsk@gmail.com",
    createdAt: new Date()
  });

  alert("Ticket enviado");
}

// 🌍 IDIOMA
let lang = "pt";

function toggleLang() {
  lang = lang === "pt" ? "en" : "pt";

  document.querySelectorAll("[data-pt]").forEach(el => {
    el.innerText = el.dataset[lang];
  });
}

// ✨ SCROLL ANIMATION
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});
