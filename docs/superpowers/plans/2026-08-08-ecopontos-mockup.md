# EcoPontos Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable, non-functional mockup of the EcoPontos app — all 9 screens navigable, driven entirely by in-memory fake data, deployable as a static site.

**Architecture:** Single-page app in plain HTML/CSS/JS, no framework, no build step. Hash-based routing shows/hides `<section class="tela">` elements. One mutable in-memory `state` object (seeded from fixed fake data) drives every dynamic render. No backend, no persistence, no real camera or auth.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox/grid), vanilla JavaScript (ES6+), `qrcodejs` via CDN for coupon QR generation. Deploy target: GitHub Pages (static, no build step).

## Global Constraints

- Colors: verde `#2E7D32`, azul `#2196F3`, branco `#FFFFFF`, dourado `#FFC107` (spec §6).
- No real backend: no Firebase, no auth, no database, no camera access (spec §1, §7).
- Mobile-first, responsive layout (spec §6); manual QA must check both mobile (~375px) and desktop viewports.
- Points table: PET=10, Alumínio/Lata=15, Papel=20 pts/unidade (spec §4).
- Níveis by `pontosTotais`: Bronze 0–999, Prata 1.000–4.999, Ouro 5.000+ (spec §4). Never decreases on redemption.
- Rewards catalog is fixed: 5% desconto=300pts, 10% desconto=600pts, Cupom R$20=1.000pts, Vale R$50=2.000pts (spec §4).
- Redemption: validates `state.usuario.pontos` balance, debits `pontos` only (never `pontosTotais`), generates `ECO-XXXXXX` code with 30-day validity (spec §4).
- Testing is manual only — no test framework, no automated tests (spec §8).
- All 9 routes must exist: `#/login`, `#/cadastro`, `#/inicio`, `#/reciclar`, `#/recompensas`, `#/cupom/:id`, `#/historico`, `#/ranking`, `#/perfil`, `#/lixeiras` (spec §5).

---

### Task 1: Project scaffold and shared styles

**Files:**
- Create: `index.html`
- Create: `css/styles.css`

**Interfaces:**
- Produces: CSS custom properties (`--verde`, `--azul`, `--branco`, `--dourado`, `--texto`, `--texto-suave`, `--fundo-suave`, `--borda`) and shared classes (`.botao`, `.botao-secundario`, `.campo`, `.card`, `.badge-nivel`, `.tela`, `.tela-ativa`) that every later task's markup relies on.
- Produces: 10 empty `<section class="tela" data-rota="#/...">` containers in `index.html`, one `<nav id="nav-bar">` with 4 links, both empty of behavior until later tasks wire them up.

- [ ] **Step 1: Create `css/styles.css`**

```css
:root {
  --verde: #2E7D32;
  --azul: #2196F3;
  --branco: #FFFFFF;
  --dourado: #FFC107;
  --texto: #1B1B1B;
  --texto-suave: #6B6B6B;
  --fundo-suave: #F4F6F5;
  --borda: #E0E0E0;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--fundo-suave);
  color: var(--texto);
  padding-bottom: 72px;
}

#app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--branco);
}

.tela { display: none; padding: 20px 16px 24px; }
.tela-ativa { display: block; }

#nav-bar {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  max-width: 480px;
  margin: 0 auto;
  background: var(--branco);
  border-top: 1px solid var(--borda);
  justify-content: space-around;
  padding: 8px 0;
}

.nav-item {
  display: flex; flex-direction: column; align-items: center;
  font-size: 11px; color: var(--texto-suave); text-decoration: none; gap: 2px;
}

.nav-item-ativo { color: var(--verde); font-weight: 600; }

.botao {
  display: inline-block; width: 100%; padding: 14px; border: none; border-radius: 10px;
  background: var(--verde); color: var(--branco); font-size: 16px; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
}

.botao:disabled { background: var(--borda); color: var(--texto-suave); cursor: not-allowed; }

.botao-secundario { background: var(--azul); }

.campo {
  width: 100%; padding: 12px; border: 1px solid var(--borda); border-radius: 8px;
  font-size: 15px; margin-bottom: 12px;
}

.card {
  background: var(--branco); border: 1px solid var(--borda); border-radius: 12px;
  padding: 16px; margin-bottom: 12px;
}

.badge-nivel {
  display: inline-flex; align-items: center; gap: 4px; background: var(--dourado);
  color: var(--texto); padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;
}

.titulo-tela { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
.texto-suave { color: var(--texto-suave); font-size: 14px; }
```

- [ ] **Step 2: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EcoPontos</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="app">
    <section class="tela" data-rota="#/login" id="tela-login"></section>
    <section class="tela" data-rota="#/cadastro" id="tela-cadastro"></section>
    <section class="tela" data-rota="#/inicio" id="tela-inicio"></section>
    <section class="tela" data-rota="#/reciclar" id="tela-reciclar"></section>
    <section class="tela" data-rota="#/recompensas" id="tela-recompensas"></section>
    <section class="tela" data-rota="#/cupom" id="tela-cupom"></section>
    <section class="tela" data-rota="#/historico" id="tela-historico"></section>
    <section class="tela" data-rota="#/ranking" id="tela-ranking"></section>
    <section class="tela" data-rota="#/perfil" id="tela-perfil"></section>
    <section class="tela" data-rota="#/lixeiras" id="tela-lixeiras"></section>
  </main>

  <nav id="nav-bar">
    <a href="#/inicio" class="nav-item" data-rota="#/inicio"><span>🏠</span><span>Início</span></a>
    <a href="#/historico" class="nav-item" data-rota="#/historico"><span>📜</span><span>Histórico</span></a>
    <a href="#/ranking" class="nav-item" data-rota="#/ranking"><span>🏆</span><span>Ranking</span></a>
    <a href="#/perfil" class="nav-item" data-rota="#/perfil"><span>👤</span><span>Perfil</span></a>
  </nav>
</body>
</html>
```

- [ ] **Step 3: Manually verify the scaffold**

Open `index.html` directly in a browser (double-click or `start index.html` on Windows). Expected: a white card area centered on a light-gray background, no visible text (all sections empty and hidden), no nav bar visible, no console errors in DevTools.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "scaffold: EcoPontos mockup shell and shared styles"
```

---

### Task 2: Fake data module

**Files:**
- Create: `js/data.js`
- Modify: `index.html` (add script tag)

**Interfaces:**
- Produces: `USUARIO_INICIAL`, `LIXEIRAS_TESTE`, `PONTOS_POR_MATERIAL`, `RECOMPENSAS`, `HISTORICO_INICIAL`, `RANKING_FAKE` — all consumed by `js/state.js` in Task 3.

- [ ] **Step 1: Create `js/data.js`**

```js
const USUARIO_INICIAL = {
  nome: "Ana Souza",
  fotoUrl: "https://i.pravatar.cc/150?img=47",
  pontos: 450,
  pontosTotais: 1450,
};

const LIXEIRAS_TESTE = [
  {
    id: "eco-001",
    endereco: "Praça Central, 100",
    itens: [
      { material: "PET", quantidade: 3 },
      { material: "Papel", quantidade: 2 },
    ],
  },
  {
    id: "eco-002",
    endereco: "Parque das Árvores, s/n",
    itens: [{ material: "Alumínio", quantidade: 5 }],
  },
  {
    id: "eco-003",
    endereco: "Shopping Vale Verde - Praça de Alimentação",
    itens: [
      { material: "PET", quantidade: 1 },
      { material: "Alumínio", quantidade: 2 },
      { material: "Papel", quantidade: 4 },
    ],
  },
];

const PONTOS_POR_MATERIAL = {
  PET: 10,
  "Alumínio": 15,
  Papel: 20,
};

const RECOMPENSAS = [
  { id: "r1", titulo: "5% de desconto", custoPontos: 300, tipo: "desconto" },
  { id: "r2", titulo: "10% de desconto", custoPontos: 600, tipo: "desconto" },
  { id: "r3", titulo: "Cupom R$20", custoPontos: 1000, tipo: "cupom" },
  { id: "r4", titulo: "Vale-compras R$50", custoPontos: 2000, tipo: "vale" },
];

const HISTORICO_INICIAL = [
  {
    data: "2026-07-20T10:00:00",
    itens: [{ material: "PET", quantidade: 2, pontosGanhos: 20 }],
    totalPontos: 20,
  },
  {
    data: "2026-07-25T15:30:00",
    itens: [{ material: "Papel", quantidade: 3, pontosGanhos: 60 }],
    totalPontos: 60,
  },
  {
    data: "2026-08-01T09:15:00",
    itens: [{ material: "Alumínio", quantidade: 4, pontosGanhos: 60 }],
    totalPontos: 60,
  },
];

const RANKING_FAKE = [
  { nome: "Carlos Lima", pontos: 8200 },
  { nome: "Beatriz Alves", pontos: 6400 },
  { nome: "João Pedro", pontos: 5100 },
  { nome: "Marina Costa", pontos: 4700 },
  { nome: "Rafael Dias", pontos: 3900 },
  { nome: "Fernanda Reis", pontos: 3200 },
  { nome: "Lucas Martins", pontos: 2500 },
  { nome: "Patrícia Nunes", pontos: 1800 },
];
```

- [ ] **Step 2: Add the script tag to `index.html`**

Insert right before the closing `</body>` tag:

```html
  <script src="js/data.js"></script>
</body>
```

- [ ] **Step 3: Manually verify**

Open `index.html` in the browser, open DevTools console, and type `RECOMPENSAS`. Expected: the array of 4 reward objects prints with no errors. Also type `LIXEIRAS_TESTE.length` — expected `3`.

- [ ] **Step 4: Commit**

```bash
git add js/data.js index.html
git commit -m "feat: add fake data module for EcoPontos mockup"
```

---

### Task 3: State module and pure business-rule functions

**Files:**
- Create: `js/state.js`
- Modify: `index.html` (add script tag)

**Interfaces:**
- Consumes: `USUARIO_INICIAL`, `LIXEIRAS_TESTE`, `PONTOS_POR_MATERIAL`, `RECOMPENSAS`, `HISTORICO_INICIAL`, `RANKING_FAKE` (from Task 2).
- Produces: mutable `state` object with shape `{ usuario: {nome, fotoUrl, pontos, pontosTotais}, lixeirasTeste, recompensas, historico, ranking, resgates, proximaLixeiraIndex }`; functions `calcularNivel(pontosTotais) -> {nome, emoji}`, `gerarCodigoCupom() -> string`, `simularLeituraLixeira() -> {lixeira, itensComPontos, totalPontos}`, `receberPontos(itensComPontos, totalPontos) -> void`, `resgatarRecompensa(recompensaId) -> resgate|null` where `resgate = {id, recompensaId, titulo, codigo, geradoEm, validadeEm, usado}`. All later render tasks depend on these exact names.

- [ ] **Step 1: Create `js/state.js`**

```js
const state = {
  usuario: { ...USUARIO_INICIAL },
  lixeirasTeste: LIXEIRAS_TESTE,
  recompensas: RECOMPENSAS,
  historico: [...HISTORICO_INICIAL],
  ranking: RANKING_FAKE,
  resgates: [],
  proximaLixeiraIndex: 0,
};

function calcularNivel(pontosTotais) {
  if (pontosTotais >= 5000) return { nome: "Ouro", emoji: "🥇" };
  if (pontosTotais >= 1000) return { nome: "Prata", emoji: "🥈" };
  return { nome: "Bronze", emoji: "🥉" };
}

function gerarCodigoCupom() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ECO-${codigo}`;
}

function simularLeituraLixeira() {
  const lixeira = state.lixeirasTeste[state.proximaLixeiraIndex];
  state.proximaLixeiraIndex = (state.proximaLixeiraIndex + 1) % state.lixeirasTeste.length;

  const itensComPontos = lixeira.itens.map((item) => ({
    ...item,
    pontosGanhos: item.quantidade * (PONTOS_POR_MATERIAL[item.material] || 0),
  }));
  const totalPontos = itensComPontos.reduce((soma, i) => soma + i.pontosGanhos, 0);

  return { lixeira, itensComPontos, totalPontos };
}

function receberPontos(itensComPontos, totalPontos) {
  state.usuario.pontos += totalPontos;
  state.usuario.pontosTotais += totalPontos;
  state.historico.unshift({
    data: new Date().toISOString(),
    itens: itensComPontos,
    totalPontos,
  });
}

function resgatarRecompensa(recompensaId) {
  const recompensa = state.recompensas.find((r) => r.id === recompensaId);
  if (!recompensa || state.usuario.pontos < recompensa.custoPontos) return null;

  state.usuario.pontos -= recompensa.custoPontos;

  const agora = new Date();
  const validade = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);
  const resgate = {
    id: `resgate-${Date.now()}`,
    recompensaId,
    titulo: recompensa.titulo,
    codigo: gerarCodigoCupom(),
    geradoEm: agora.toISOString(),
    validadeEm: validade.toISOString(),
    usado: false,
  };
  state.resgates.push(resgate);
  return resgate;
}
```

- [ ] **Step 2: Add the script tag to `index.html`**

```html
  <script src="js/data.js"></script>
  <script src="js/state.js"></script>
</body>
```

- [ ] **Step 3: Manually verify in the browser console**

```js
calcularNivel(0).nome        // "Bronze"
calcularNivel(1200).nome     // "Prata"
calcularNivel(5200).nome     // "Ouro"
simularLeituraLixeira()      // { lixeira: {...}, itensComPontos: [...], totalPontos: <number> }
state.usuario.pontos         // 450
receberPontos([{material:"PET", quantidade:1, pontosGanhos:10}], 10)
state.usuario.pontos         // 460
resgatarRecompensa("r1")     // { id: "resgate-...", codigo: "ECO-XXXXXX", ... } (460 < 300 is false so this succeeds, pontos becomes 160)
resgatarRecompensa("r4")     // null (2000 > remaining balance)
```

Confirm each line's actual output matches the comment before moving on.

- [ ] **Step 4: Commit**

```bash
git add js/state.js index.html
git commit -m "feat: add in-memory state and business-rule functions"
```

---

### Task 4: Router, render dispatcher, Login and Cadastro screens

**Files:**
- Create: `js/router.js`
- Create: `js/render.js`
- Modify: `index.html` (fill `#tela-login`, `#tela-cadastro` sections; add script tags)

**Interfaces:**
- Consumes: `state` (Task 3).
- Produces: `mostrarTela()` (re-evaluates `window.location.hash` and toggles `.tela-ativa`/nav visibility), `RENDERIZADORES` (object map of `hash -> renderFn`, extended by every later screen task), `renderizarTela(hash)` (looks up and calls the matching renderer). Later tasks add their own `render<Tela>()` function and one line to `RENDERIZADORES`.

- [ ] **Step 1: Fill in the login and cadastro sections in `index.html`**

Replace `<section class="tela" data-rota="#/login" id="tela-login"></section>`:

```html
<section class="tela" data-rota="#/login" id="tela-login">
  <p class="titulo-tela">🌱 EcoPontos</p>
  <form id="form-login">
    <input class="campo" type="email" placeholder="Email" required />
    <input class="campo" type="password" placeholder="Senha" required />
    <button type="submit" class="botao">Entrar</button>
  </form>
  <button type="button" class="botao botao-secundario" id="botao-google" style="margin-top: 12px;">Entrar com Google</button>
  <p class="texto-suave" style="margin-top: 16px; text-align: center;">
    Não tem conta? <a href="#/cadastro">Cadastre-se</a>
  </p>
</section>
```

Replace `<section class="tela" data-rota="#/cadastro" id="tela-cadastro"></section>`:

```html
<section class="tela" data-rota="#/cadastro" id="tela-cadastro">
  <p class="titulo-tela">Criar conta</p>
  <form id="form-cadastro">
    <input class="campo" type="text" placeholder="Nome" required />
    <input class="campo" type="email" placeholder="Email" required />
    <input class="campo" type="password" placeholder="Senha" required />
    <button type="submit" class="botao">Criar conta</button>
  </form>
  <p class="texto-suave" style="margin-top: 16px; text-align: center;">
    Já tem conta? <a href="#/login">Entrar</a>
  </p>
</section>
```

- [ ] **Step 2: Create `js/render.js`**

```js
function renderLogin() {
  // formulário estático — nada dinâmico para renderizar
}

function renderCadastro() {
  // formulário estático — nada dinâmico para renderizar
}

const RENDERIZADORES = {
  "#/login": renderLogin,
  "#/cadastro": renderCadastro,
};

function renderizarTela(hash) {
  const renderizador = RENDERIZADORES[hash];
  if (renderizador) renderizador();
}
```

- [ ] **Step 3: Create `js/router.js`**

```js
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
}

window.addEventListener("hashchange", mostrarTela);
window.addEventListener("DOMContentLoaded", () => {
  iniciarEventos();
  if (!window.location.hash) window.location.hash = "#/login";
  mostrarTela();
});
```

- [ ] **Step 4: Add script tags to `index.html`**

```html
  <script src="js/data.js"></script>
  <script src="js/state.js"></script>
  <script src="js/render.js"></script>
  <script src="js/router.js"></script>
</body>
```

- [ ] **Step 5: Manually verify**

Open `index.html`. Expected: lands on `#/login` automatically, nav bar hidden. Fill any email/password and click "Entrar" — expected: URL hash becomes `#/inicio`, still nothing visible (screen empty, that's expected until Task 5), nav bar now visible with "Início" highlighted. Click browser back button — expected: returns to `#/login`, nav bar hides again. Manually navigate to `#/cadastro` via the link and confirm the form displays and submitting it also lands on `#/inicio`.

- [ ] **Step 6: Commit**

```bash
git add index.html js/router.js js/render.js
git commit -m "feat: add hash router and login/cadastro screens"
```

---

### Task 5: Início screen

**Files:**
- Modify: `index.html` (fill `#tela-inicio`)
- Modify: `js/render.js` (add `renderInicio`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.usuario`, `calcularNivel` (Task 3).
- Produces: nothing new consumed by later tasks (leaf screen), but establishes the pattern every later screen task follows: one `render<Tela>()` function reading from `state` and writing into DOM containers by id, registered in `RENDERIZADORES`.

- [ ] **Step 1: Fill in the início section in `index.html`**

```html
<section class="tela" data-rota="#/inicio" id="tela-inicio">
  <p class="titulo-tela" id="inicio-saudacao"></p>
  <div class="card">
    <p class="texto-suave">Seus pontos</p>
    <p style="font-size: 32px; font-weight: 700; color: var(--verde);" id="inicio-pontos"></p>
    <span class="badge-nivel" id="inicio-nivel"></span>
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
    <a href="#/reciclar" class="card" style="text-decoration:none; color:inherit; text-align:center;">♻️<br />Reciclar</a>
    <a href="#/recompensas" class="card" style="text-decoration:none; color:inherit; text-align:center;">🎁<br />Recompensas</a>
    <a href="#/lixeiras" class="card" style="text-decoration:none; color:inherit; text-align:center;">📍<br />Lixeiras</a>
    <a href="#/ranking" class="card" style="text-decoration:none; color:inherit; text-align:center;">🏆<br />Ranking</a>
  </div>
</section>
```

- [ ] **Step 2: Add `renderInicio` to `js/render.js`**

```js
function renderInicio() {
  const nivel = calcularNivel(state.usuario.pontosTotais);
  document.getElementById("inicio-saudacao").textContent = `Olá, ${state.usuario.nome} 👋`;
  document.getElementById("inicio-pontos").textContent = `${state.usuario.pontos} pts`;
  document.getElementById("inicio-nivel").textContent = `${nivel.emoji} ${nivel.nome}`;
}
```

Register it in the `RENDERIZADORES` map (add this line inside the existing object literal, after `"#/cadastro": renderCadastro,`):

```js
  "#/inicio": renderInicio,
```

- [ ] **Step 3: Manually verify**

Reload `index.html`, log in. Expected: início screen shows "Olá, Ana Souza 👋", "450 pts", a gold "🥈 Prata" badge (since `pontosTotais` starts at 1450), and 4 tappable cards. Click each card and confirm the hash changes (screens still blank except início/login, that's expected).

- [ ] **Step 4: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add início screen"
```

---

### Task 6: Reciclar screen (simulated QR scan)

**Files:**
- Modify: `index.html` (fill `#tela-reciclar`)
- Modify: `js/render.js` (add `renderReciclar`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `simularLeituraLixeira()`, `receberPontos()` (Task 3).
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Fill in the reciclar section in `index.html`**

```html
<section class="tela" data-rota="#/reciclar" id="tela-reciclar">
  <p class="titulo-tela">Reciclar</p>
  <div class="card" style="background: linear-gradient(135deg, #263238, #37474F); color: #fff; text-align: center; padding: 40px 16px;">
    <p style="font-size: 40px;">📷</p>
    <p class="texto-suave" style="color: #cfd8dc;">Aponte a câmera para o QR Code da lixeira</p>
  </div>
  <button class="botao" id="botao-simular-qr">Simular leitura de QR</button>

  <div id="reciclar-resultado" style="display:none; margin-top: 16px;">
    <div class="card">
      <p class="texto-suave" id="reciclar-endereco"></p>
      <ul id="reciclar-itens" style="list-style:none; margin-top: 8px;"></ul>
      <p style="font-weight:700; margin-top: 8px;" id="reciclar-total"></p>
    </div>
    <button class="botao" id="botao-receber-pontos">Receber Pontos</button>
  </div>
</section>
```

- [ ] **Step 2: Add `renderReciclar` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/reciclar": renderReciclar,
```

- [ ] **Step 3: Wire the two buttons in `iniciarEventos()` in `js/router.js`**

Add these two lines inside `iniciarEventos()`, after the existing `form-cadastro` listener:

```js
  document.getElementById("botao-simular-qr").addEventListener("click", simularQR);
  document.getElementById("botao-receber-pontos").addEventListener("click", confirmarRecebimento);
```

- [ ] **Step 4: Manually verify**

Navigate to `#/reciclar`. Click "Simular leitura de QR" three times in a row — expected: each click shows a different lixeira's address and items (cycles through the 3 test lixeiras from `LIXEIRAS_TESTE`, wrapping back to the first on the 4th click). Click "Receber Pontos" — expected: redirected to `#/inicio`, points total increased by the shown amount.

- [ ] **Step 5: Commit**

```bash
git add index.html js/render.js js/router.js
git commit -m "feat: add reciclar screen with simulated QR scan"
```

---

### Task 7: Recompensas screen

**Files:**
- Modify: `index.html` (fill `#tela-recompensas`)
- Modify: `js/render.js` (add `renderRecompensas`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.recompensas`, `state.usuario.pontos`, `resgatarRecompensa()` (Task 3).
- Produces: none new (leaf screen); navigates to `#/cupom/:id` consumed by Task 8.

- [ ] **Step 1: Fill in the recompensas section in `index.html`**

```html
<section class="tela" data-rota="#/recompensas" id="tela-recompensas">
  <p class="titulo-tela">Recompensas</p>
  <p class="texto-suave">Saldo: <strong id="recompensas-saldo"></strong></p>
  <div id="recompensas-lista" style="margin-top: 16px;"></div>
</section>
```

- [ ] **Step 2: Add `renderRecompensas` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/recompensas": renderRecompensas,
```

- [ ] **Step 3: Manually verify**

Navigate to `#/recompensas`. Expected: 4 reward cards, saldo shown at top. With a low balance (e.g. right after login, 450 pts), "5% de desconto" (300 pts) is enabled and the rest show "Faltam N pts" and are disabled. Click "Resgatar" on the enabled one — expected: redirected to `#/cupom/resgate-...` (blank screen for now, that's expected until Task 8), and balance on `#/recompensas` (if you navigate back) is reduced by 300.

- [ ] **Step 4: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add recompensas screen"
```

---

### Task 8: Cupom screen

**Files:**
- Modify: `index.html` (fill `#tela-cupom`, add QR library CDN script)
- Modify: `js/render.js` (add `renderCupom`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.resgates`, `rotaAtual()` (Task 3, Task 4), global `QRCode` constructor from the `qrcodejs` CDN library.
- Produces: none new (leaf screen).

- [ ] **Step 1: Add the QR code library to `index.html`**

Add this line before the `js/data.js` script tag:

```html
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <script src="js/data.js"></script>
```

- [ ] **Step 2: Fill in the cupom section in `index.html`**

```html
<section class="tela" data-rota="#/cupom" id="tela-cupom">
  <p class="titulo-tela">🎉 Cupom gerado!</p>
  <div class="card" style="text-align:center;">
    <p style="font-weight:600;" id="cupom-titulo"></p>
    <div id="cupom-qrcode" style="display:flex; justify-content:center; margin: 16px 0;"></div>
    <p style="font-size: 20px; font-weight:700; letter-spacing: 1px;" id="cupom-codigo"></p>
    <p class="texto-suave" id="cupom-validade"></p>
  </div>
  <a href="#/inicio" class="botao" style="margin-top:16px;">Voltar ao início</a>
</section>
```

- [ ] **Step 3: Add `renderCupom` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/cupom": renderCupom,
```

- [ ] **Step 4: Manually verify**

From `#/recompensas`, resgatar a reward. Expected: lands on `#/cupom/resgate-...`, shows the reward title, a scannable-looking QR code image, a code like `ECO-A1B2C3`, and "Válido até" a date 30 days from today. Click "Voltar ao início" and confirm it returns to `#/inicio`.

- [ ] **Step 5: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add cupom screen with QR code generation"
```

---

### Task 9: Histórico screen

**Files:**
- Modify: `index.html` (fill `#tela-historico`)
- Modify: `js/render.js` (add `renderHistorico`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.historico` (Task 3).
- Produces: none new (leaf screen).

- [ ] **Step 1: Fill in the histórico section in `index.html`**

```html
<section class="tela" data-rota="#/historico" id="tela-historico">
  <p class="titulo-tela">Histórico</p>
  <div class="card" id="historico-totais"></div>
  <div id="historico-lista"></div>
</section>
```

- [ ] **Step 2: Add `renderHistorico` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/historico": renderHistorico,
```

- [ ] **Step 3: Manually verify**

Navigate to `#/historico`. Expected: totals card shows aggregated quantities per material across all entries, list below shows each recycling entry newest-first with date, items, and points. Go recycle something on `#/reciclar` and confirm it appears at the top of `#/historico` afterward.

- [ ] **Step 4: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add histórico screen"
```

---

### Task 10: Ranking screen

**Files:**
- Modify: `index.html` (fill `#tela-ranking`)
- Modify: `js/render.js` (add `renderRanking`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.ranking`, `state.usuario` (Task 3).
- Produces: none new (leaf screen).

- [ ] **Step 1: Fill in the ranking section in `index.html`**

```html
<section class="tela" data-rota="#/ranking" id="tela-ranking">
  <p class="titulo-tela">Ranking</p>
  <div id="ranking-lista"></div>
</section>
```

- [ ] **Step 2: Add `renderRanking` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/ranking": renderRanking,
```

- [ ] **Step 3: Manually verify**

Navigate to `#/ranking`. With the initial 450 pts, the user should appear near the bottom, outside the top 10 (there are 8 fake users all with more points, so the user should be within top 10 actually since only 8 fake entries exist — confirm the row for "(você)" is visible either inside the top10 list or after a "..." separator, and that its points match `state.usuario.pontos` exactly).

- [ ] **Step 4: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add ranking screen"
```

---

### Task 11: Perfil screen

**Files:**
- Modify: `index.html` (fill `#tela-perfil`)
- Modify: `js/render.js` (add `renderPerfil`, register in `RENDERIZADORES`)
- Modify: `js/router.js` (wire "Sair" button in `iniciarEventos()`)

**Interfaces:**
- Consumes: `state.usuario`, `calcularNivel()` (Task 3).
- Produces: none new (leaf screen).

- [ ] **Step 1: Fill in the perfil section in `index.html`**

```html
<section class="tela" data-rota="#/perfil" id="tela-perfil">
  <p class="titulo-tela">Perfil</p>
  <div class="card" style="text-align:center;">
    <img id="perfil-foto" style="width:80px; height:80px; border-radius:50%;" />
    <p style="font-weight:700; margin-top:8px;" id="perfil-nome"></p>
    <span class="badge-nivel" id="perfil-nivel"></span>
    <p class="texto-suave" style="margin-top:8px;" id="perfil-pontos"></p>
  </div>
  <div class="card texto-suave">Configurações (em breve)</div>
  <button class="botao botao-secundario" id="botao-sair">Sair</button>
</section>
```

- [ ] **Step 2: Add `renderPerfil` to `js/render.js`**

```js
function renderPerfil() {
  const nivel = calcularNivel(state.usuario.pontosTotais);
  document.getElementById("perfil-foto").src = state.usuario.fotoUrl;
  document.getElementById("perfil-nome").textContent = state.usuario.nome;
  document.getElementById("perfil-nivel").textContent = `${nivel.emoji} ${nivel.nome}`;
  document.getElementById("perfil-pontos").textContent = `${state.usuario.pontos} pts disponíveis (${state.usuario.pontosTotais} pts totais)`;
}
```

Register it in `RENDERIZADORES`:

```js
  "#/perfil": renderPerfil,
```

- [ ] **Step 3: Wire the "Sair" button in `iniciarEventos()` in `js/router.js`**

Add this line inside `iniciarEventos()`:

```js
  document.getElementById("botao-sair").addEventListener("click", () => {
    window.location.hash = "#/login";
  });
```

- [ ] **Step 4: Manually verify**

Navigate to `#/perfil`. Expected: fake avatar image, name "Ana Souza", level badge, points line showing both current and total points. Click "Sair" — expected: redirected to `#/login`, nav bar hides.

- [ ] **Step 5: Commit**

```bash
git add index.html js/render.js js/router.js
git commit -m "feat: add perfil screen with sair action"
```

---

### Task 12: Lixeiras screen

**Files:**
- Modify: `index.html` (fill `#tela-lixeiras`)
- Modify: `js/render.js` (add `renderLixeiras`, register in `RENDERIZADORES`)

**Interfaces:**
- Consumes: `state.lixeirasTeste` (Task 3).
- Produces: none new (leaf screen, last one).

- [ ] **Step 1: Fill in the lixeiras section in `index.html`**

```html
<section class="tela" data-rota="#/lixeiras" id="tela-lixeiras">
  <p class="titulo-tela">Lixeiras cadastradas</p>
  <div id="lixeiras-lista"></div>
</section>
```

- [ ] **Step 2: Add `renderLixeiras` to `js/render.js`**

```js
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
```

Register it in `RENDERIZADORES`:

```js
  "#/lixeiras": renderLixeiras,
```

- [ ] **Step 3: Manually verify**

Navigate to `#/lixeiras`. Expected: 3 cards, one per test lixeira, showing address and its fixed item list — same 3 combinations seen while simulating QR reads on `#/reciclar`.

- [ ] **Step 4: Commit**

```bash
git add index.html js/render.js
git commit -m "feat: add lixeiras screen"
```

---

### Task 13: Full manual QA pass

**Files:**
- Modify: any file where a bug is found during this pass (fixes only, no new features).

**Interfaces:**
- Consumes: the complete app from Tasks 1–12.
- Produces: nothing new — this task is verification and bugfixing only.

- [ ] **Step 1: Desktop walkthrough**

Open `index.html` in a browser window at a normal desktop width (~1280px). Walk through, in order: land on `#/login` → log in with any credentials → land on `#/inicio` with correct name/points/level → go to `#/reciclar` → simulate a QR read twice (confirm two different lixeiras shown) → click "Receber Pontos" on the second one → confirm `#/inicio` points increased by that amount → go to `#/recompensas` → resgatar a reward the balance covers → confirm redirected to `#/cupom/:id` with a QR image, code, and validity date → click "Voltar ao início" → go to `#/historico` → confirm the two just-earned entries appear at the top with correct totals → go to `#/ranking` → confirm the user's row shows the current point total → go to `#/perfil` → confirm name/level/points match → go to `#/lixeiras` → confirm 3 entries → click "Sair" → confirm back at `#/login` with nav bar hidden.

- [ ] **Step 2: Mobile viewport walkthrough**

Open DevTools, toggle device toolbar, set width to 375px. Repeat the same walkthrough from Step 1. Confirm: no horizontal scrollbar, nav bar icons/labels fit without wrapping oddly, cards and buttons remain full-width and tappable, the reciclar screen's fake camera box doesn't overflow.

- [ ] **Step 3: Fix any issues found**

For each issue found in Steps 1–2, make the minimal fix in the relevant file (CSS for layout issues, `js/render.js` for data/display bugs, `js/router.js` for navigation bugs). Re-run the affected part of the walkthrough to confirm the fix.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: address issues found in manual QA pass"
```

If Step 3 found no issues, skip this commit — there is nothing to commit.

---

### Task 14: Deploy to GitHub Pages

**Files:**
- Create (if missing): `.github/workflows/deploy.yml` (only if the repo does not already have a `gh-pages` deployment mechanism)

**Interfaces:**
- Consumes: the complete static site from Tasks 1–13 (`index.html`, `css/`, `js/`).
- Produces: a public URL for the mockup.

- [ ] **Step 1: Confirm a GitHub remote exists**

```bash
git remote -v
```

If there is no remote, stop here and ask the user for the target GitHub repository before proceeding — creating one is an action outside this plan's scope.

- [ ] **Step 2: Push the current branch**

```bash
git push -u origin master
```

- [ ] **Step 3: Enable GitHub Pages (manual step — requires the user)**

This step happens in the GitHub web UI and cannot be done from the CLI: go to the repository's **Settings → Pages**, under "Build and deployment" set **Source: Deploy from a branch**, **Branch: master**, **Folder: / (root)**, then save. Ask the user to confirm they've done this (or do it themselves) before considering this task complete — this publishes a public link, so don't do it silently.

- [ ] **Step 4: Verify the deployed link**

Once GitHub reports the Pages build as complete (Settings → Pages shows the live URL, typically `https://<user>.github.io/<repo>/`), open it and repeat the Task 13 desktop walkthrough against the deployed version to confirm it works identically to the local file.

---

## Self-Review Notes

- **Spec coverage:** All 9 routes (Task 4, 5, 6, 7, 8, 9, 10, 11, 12) match spec §5 exactly. Points table and level thresholds (Task 3) match spec §4. Rewards catalog (Task 2) matches spec §4. Redemption flow (debit `pontos` only, `ECO-XXXXXX` code, 30-day validity — Task 3) matches spec §4. Colors (Task 1) match spec §6. Manual-only testing (Task 13, no test framework anywhere in the plan) matches spec §8. Static deploy (Task 14) matches spec §9.
- **Type consistency:** `state.usuario.{pontos,pontosTotais}` used consistently from Task 3 through Tasks 5, 6, 7, 11. `resgate.{id,titulo,codigo,validadeEm}` produced in Task 3, consumed identically in Task 8. `RENDERIZADORES` map and `renderizarTela`/`mostrarTela` names introduced in Task 4 are reused with the same names in every subsequent task.
- **No placeholders:** every step above contains complete, runnable code — no TBD/TODO markers.
