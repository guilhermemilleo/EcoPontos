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

  if (ultimoGanho) {
    celebrarGanhoDePontos(ultimoGanho);
    ultimoGanho = null;
  }
}

let ultimoGanho = null;

function celebrarGanhoDePontos(ganho) {
  const pontosEl = document.getElementById("inicio-pontos");
  const cardEl = document.getElementById("inicio-pontos-card");

  pontosEl.classList.remove("pontos-pulso");
  void pontosEl.offsetWidth;
  pontosEl.classList.add("pontos-pulso");

  const flutuante = document.createElement("span");
  flutuante.className = "pontos-flutuante";
  flutuante.textContent = `+${ganho.total} pts`;
  cardEl.appendChild(flutuante);
  flutuante.addEventListener("animationend", () => flutuante.remove());

  if (ganho.subiuDeNivel) {
    setTimeout(() => mostrarOverlayNivel(ganho.nivel), 650);
  }
}

function mostrarOverlayNivel(nivel) {
  document.getElementById("overlay-nivel-emoji").textContent = nivel.emoji;
  document.getElementById("overlay-nivel-nome").textContent = nivel.nome;
  const overlay = document.getElementById("overlay-nivel");
  overlay.style.display = "flex";
  document.getElementById("botao-fechar-nivel").focus();
}

function fecharOverlayNivel() {
  document.getElementById("overlay-nivel").style.display = "none";
}

let ultimaLeitura = null;

function renderReciclar() {
  document.getElementById("reciclar-resultado").style.display = "none";
  document.getElementById("botao-simular-qr").disabled = false;
}

function lixeiraForcadaPelaUrl() {
  const [, query] = rotaAtual().split("?");
  return query ? new URLSearchParams(query).get("lixeira") : null;
}

function simularQR() {
  ultimaLeitura = simularLeituraLixeira(lixeiraForcadaPelaUrl());
  document.getElementById("reciclar-endereco").textContent = ultimaLeitura.lixeira.endereco;
  document.getElementById("reciclar-itens").innerHTML = ultimaLeitura.itensComPontos
    .map((i) => `<li>${i.quantidade}x ${i.material} — ${i.pontosGanhos} pts</li>`)
    .join("");
  document.getElementById("reciclar-total").textContent = `Total: ${ultimaLeitura.totalPontos} pts`;
  document.getElementById("reciclar-resultado").style.display = "block";
}

function confirmarRecebimento() {
  if (!ultimaLeitura) return;
  const nivelAntes = calcularNivel(state.usuario.pontosTotais);
  receberPontos(ultimaLeitura.itensComPontos, ultimaLeitura.totalPontos);
  const nivelDepois = calcularNivel(state.usuario.pontosTotais);

  ultimoGanho = {
    total: ultimaLeitura.totalPontos,
    subiuDeNivel: nivelDepois.nome !== nivelAntes.nome,
    nivel: nivelDepois,
  };

  ultimaLeitura = null;
  window.location.hash = "#/inicio";
}

function renderRecompensas() {
  document.getElementById("recompensas-saldo").textContent = `${state.usuario.pontos} pts`;

  const nenhumaAlcancavel = state.recompensas.every((r) => r.custoPontos > state.usuario.pontos);
  const custoMinimo = Math.min(...state.recompensas.map((r) => r.custoPontos));
  const avisoSaldoBaixo = nenhumaAlcancavel
    ? `
      <div class="card estado-vazio">
        <p class="estado-vazio-icone">🌱</p>
        <p style="font-weight:600;">Ainda faltam pontos para sua primeira recompensa</p>
        <p class="texto-suave">Recicle mais para chegar aos ${custoMinimo} pts da recompensa mais barata.</p>
        <a href="#/reciclar" class="botao" style="margin-top:12px;">Reciclar agora</a>
      </div>
    `
    : "";

  document.getElementById("recompensas-lista").innerHTML = avisoSaldoBaixo + state.recompensas
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
      abrirConfirmarResgate(botao.dataset.resgatar);
    });
  });
}

let recompensaPendente = null;

function abrirConfirmarResgate(recompensaId) {
  const recompensa = state.recompensas.find((r) => r.id === recompensaId);
  if (!recompensa) return;

  recompensaPendente = recompensaId;
  const saldoRestante = state.usuario.pontos - recompensa.custoPontos;

  document.getElementById("confirmar-resgate-titulo").textContent = recompensa.titulo;
  document.getElementById("confirmar-resgate-detalhe").textContent =
    `Vai custar ${recompensa.custoPontos} pts. Saldo depois do resgate: ${saldoRestante} pts.`;

  const overlay = document.getElementById("overlay-confirmar-resgate");
  overlay.style.display = "flex";
  document.getElementById("botao-confirmar-resgate").focus();
}

function fecharOverlayConfirmarResgate() {
  document.getElementById("overlay-confirmar-resgate").style.display = "none";
  recompensaPendente = null;
}

function confirmarResgatePendente() {
  if (!recompensaPendente) return;
  const resgate = resgatarRecompensa(recompensaPendente);
  fecharOverlayConfirmarResgate();
  if (resgate) window.location.hash = `#/cupom/${resgate.id}`;
}

function renderCupom() {
  const id = rotaAtual().split("/")[2];
  const resgate = state.resgates.find((r) => r.id === id);
  if (!resgate) {
    document.getElementById("tela-cupom").classList.remove("tela-ativa");
    window.location.hash = "#/inicio";
    return;
  }

  document.getElementById("cupom-titulo").textContent = resgate.titulo;
  document.getElementById("cupom-codigo").textContent = resgate.codigo;
  const validade = new Date(resgate.validadeEm).toLocaleDateString("pt-BR");
  document.getElementById("cupom-validade").textContent = `Válido até ${validade}`;

  const container = document.getElementById("cupom-qrcode");
  container.innerHTML = "";
  new QRCode(container, { text: resgate.codigo, width: 160, height: 160 });
}

function renderHistorico() {
  if (state.historico.length === 0) {
    document.getElementById("historico-totais").style.display = "none";
    document.getElementById("historico-lista").innerHTML = `
      <div class="card estado-vazio">
        <p class="estado-vazio-icone">♻️</p>
        <p style="font-weight:600;">Você ainda não reciclou nada</p>
        <p class="texto-suave">Seus pontos e materiais reciclados vão aparecer aqui.</p>
        <a href="#/reciclar" class="botao" style="margin-top:12px;">Reciclar agora</a>
      </div>
    `;
    return;
  }

  document.getElementById("historico-totais").style.display = "";

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
  const todos = [...state.ranking, { nome: `${state.usuario.nome} (você)`, pontos: state.usuario.pontosTotais }]
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
    html += linha({ nome: `${state.usuario.nome} (você)`, pontos: state.usuario.pontosTotais }, posicaoUsuario);
  }

  document.getElementById("ranking-lista").innerHTML = html;
}

function iniciaisDoNome(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function renderPerfil() {
  const nivel = calcularNivel(state.usuario.pontosTotais);
  document.getElementById("perfil-avatar").textContent = iniciaisDoNome(state.usuario.nome);
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
