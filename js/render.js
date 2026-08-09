function renderLogin() {
  // formulário estático — nada dinâmico para renderizar
}

function renderCadastro() {
  // formulário estático — nada dinâmico para renderizar
}

function renderInicio() {
  const nivel = calcularNivel(state.usuario.pontosTotais);
  document.getElementById("inicio-saudacao").textContent = `Olá, ${state.usuario.nome} 👋`;
  document.getElementById("inicio-pontos").textContent = `${state.usuario.pontos} pts`;
  document.getElementById("inicio-nivel").textContent = `${nivel.emoji} ${nivel.nome}`;
}

let ultimaLeitura = null;

function renderReciclar() {
  document.getElementById("reciclar-resultado").style.display = "none";
  document.getElementById("botao-simular-qr").disabled = false;
}

function simularQR() {
  ultimaLeitura = simularLeituraLixeira();
  document.getElementById("reciclar-endereco").textContent = ultimaLeitura.lixeira.endereco;
  document.getElementById("reciclar-itens").innerHTML = ultimaLeitura.itensComPontos
    .map((i) => `<li>${i.quantidade}x ${i.material} — ${i.pontosGanhos} pts</li>`)
    .join("");
  document.getElementById("reciclar-total").textContent = `Total: ${ultimaLeitura.totalPontos} pts`;
  document.getElementById("reciclar-resultado").style.display = "block";
}

function confirmarRecebimento() {
  if (!ultimaLeitura) return;
  receberPontos(ultimaLeitura.itensComPontos, ultimaLeitura.totalPontos);
  ultimaLeitura = null;
  window.location.hash = "#/inicio";
}

function renderRecompensas() {
  document.getElementById("recompensas-saldo").textContent = `${state.usuario.pontos} pts`;

  document.getElementById("recompensas-lista").innerHTML = state.recompensas
    .map((r) => {
      const faltam = r.custoPontos - state.usuario.pontos;
      const desabilitado = faltam > 0;
      const textoBotao = desabilitado ? `Faltam ${faltam} pts` : "Resgatar";
      return `
        <div class="card">
          <p style="font-weight:600;">${r.titulo}</p>
          <p class="texto-suave">${r.custoPontos} pts</p>
          <button class="botao" style="margin-top:8px;" data-resgatar="${r.id}" ${desabilitado ? "disabled" : ""}>${textoBotao}</button>
        </div>
      `;
    })
    .join("");

  document.getElementById("recompensas-lista").querySelectorAll("[data-resgatar]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const resgate = resgatarRecompensa(botao.dataset.resgatar);
      if (resgate) window.location.hash = `#/cupom/${resgate.id}`;
    });
  });
}

function renderCupom() {
  const id = rotaAtual().split("/")[2];
  const resgate = state.resgates.find((r) => r.id === id);
  if (!resgate) return;

  document.getElementById("cupom-titulo").textContent = resgate.titulo;
  document.getElementById("cupom-codigo").textContent = resgate.codigo;
  const validade = new Date(resgate.validadeEm).toLocaleDateString("pt-BR");
  document.getElementById("cupom-validade").textContent = `Válido até ${validade}`;

  const container = document.getElementById("cupom-qrcode");
  container.innerHTML = "";
  new QRCode(container, { text: resgate.codigo, width: 160, height: 160 });
}

function renderHistorico() {
  const totaisPorMaterial = {};
  state.historico.forEach((registro) => {
    registro.itens.forEach((item) => {
      totaisPorMaterial[item.material] = (totaisPorMaterial[item.material] || 0) + item.quantidade;
    });
  });

  document.getElementById("historico-totais").innerHTML = `
    <p style="font-weight:600; margin-bottom:8px;">Totais por material</p>
    ${Object.entries(totaisPorMaterial)
      .map(([material, qtd]) => `<p class="texto-suave">${material}: ${qtd} un.</p>`)
      .join("")}
  `;

  const registrosOrdenados = [...state.historico].sort((a, b) => new Date(b.data) - new Date(a.data));

  document.getElementById("historico-lista").innerHTML = registrosOrdenados
    .map((registro) => {
      const data = new Date(registro.data).toLocaleDateString("pt-BR");
      const itensTexto = registro.itens.map((i) => `${i.quantidade}x ${i.material}`).join(", ");
      return `
        <div class="card">
          <p class="texto-suave">${data}</p>
          <p>${itensTexto}</p>
          <p style="font-weight:600;">+${registro.totalPontos} pts</p>
        </div>
      `;
    })
    .join("");
}

function renderRanking() {
  const todos = [...state.ranking, { nome: `${state.usuario.nome} (você)`, pontos: state.usuario.pontos }]
    .sort((a, b) => b.pontos - a.pontos);

  const top10 = todos.slice(0, 10);
  const posicaoUsuario = todos.findIndex((p) => p.nome.endsWith("(você)")) + 1;
  const usuarioNoTop10 = posicaoUsuario <= 10;

  const linha = (pessoa, posicao) => `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center; ${pessoa.nome.endsWith("(você)") ? "border-color: var(--verde); border-width: 2px;" : ""}">
      <span>${posicao}. ${pessoa.nome}</span>
      <strong>${pessoa.pontos} pts</strong>
    </div>
  `;

  let html = top10.map((p, i) => linha(p, i + 1)).join("");

  if (!usuarioNoTop10) {
    html += `<p class="texto-suave" style="text-align:center; margin: 8px 0;">...</p>`;
    html += linha({ nome: `${state.usuario.nome} (você)`, pontos: state.usuario.pontos }, posicaoUsuario);
  }

  document.getElementById("ranking-lista").innerHTML = html;
}

function renderPerfil() {
  const nivel = calcularNivel(state.usuario.pontosTotais);
  document.getElementById("perfil-foto").src = state.usuario.fotoUrl;
  document.getElementById("perfil-nome").textContent = state.usuario.nome;
  document.getElementById("perfil-nivel").textContent = `${nivel.emoji} ${nivel.nome}`;
  document.getElementById("perfil-pontos").textContent = `${state.usuario.pontos} pts disponíveis (${state.usuario.pontosTotais} pts totais)`;
}

function renderLixeiras() {
  document.getElementById("lixeiras-lista").innerHTML = state.lixeirasTeste
    .map((l) => {
      const itensTexto = l.itens.map((i) => `${i.quantidade}x ${i.material}`).join(", ");
      return `
        <div class="card">
          <p style="font-weight:600;">📍 ${l.endereco}</p>
          <p class="texto-suave">${itensTexto}</p>
        </div>
      `;
    })
    .join("");
}

const RENDERIZADORES = {
  "#/login": renderLogin,
  "#/cadastro": renderCadastro,
  "#/inicio": renderInicio,
  "#/reciclar": renderReciclar,
  "#/recompensas": renderRecompensas,
  "#/cupom": renderCupom,
  "#/historico": renderHistorico,
  "#/ranking": renderRanking,
  "#/perfil": renderPerfil,
  "#/lixeiras": renderLixeiras,
};

function renderizarTela(hash) {
  const renderizador = RENDERIZADORES[hash];
  if (renderizador) renderizador();
}
