const ROTAS_PUBLICAS = ["#/login", "#/cadastro"];

function rotaAtual() {
  return window.location.hash || "#/login";
}

function mostrarTela() {
  const hashCompleto = rotaAtual();
  const hashBase = hashCompleto.startsWith("#/cupom/") ? "#/cupom" : hashCompleto.split("?")[0];

  document.querySelectorAll(".tela").forEach((el) => el.classList.remove("tela-ativa"));
  const tela = document.querySelector(`.tela[data-rota="${hashBase}"]`);
  if (tela) tela.classList.add("tela-ativa");

  const navBar = document.getElementById("nav-bar");
  navBar.style.display = ROTAS_PUBLICAS.includes(hashBase) ? "none" : "flex";

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("nav-item-ativo", item.dataset.rota === hashBase);
  });

  renderizarTela(hashBase);
}

function iniciarEventos() {
  document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.hash = "#/inicio";
  });

  document.getElementById("botao-google").addEventListener("click", () => {
    window.location.hash = "#/inicio";
  });

  document.getElementById("form-cadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.hash = "#/inicio";
  });

  document.getElementById("botao-simular-qr").addEventListener("click", simularQR);
  document.getElementById("botao-receber-pontos").addEventListener("click", confirmarRecebimento);

  document.getElementById("botao-sair").addEventListener("click", () => {
    window.location.hash = "#/login";
  });
}

window.addEventListener("hashchange", mostrarTela);
window.addEventListener("DOMContentLoaded", () => {
  iniciarEventos();
  if (!window.location.hash) window.location.hash = "#/login";
  mostrarTela();
});
