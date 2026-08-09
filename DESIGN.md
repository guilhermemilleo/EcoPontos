---
name: EcoPontos
description: Recompensa reciclagem em lixeiras inteligentes com pontos, níveis e resgates instantâneos.
colors:
  verde-recibo: "#2E7D32"
  azul-acao: "#1565C0"
  dourado-conquista: "#FFC107"
  papel: "#FFFFFF"
  fundo-suave: "#F4F6F5"
  tinta: "#1B1B1B"
  tinta-suave: "#6B6B6B"
  linha: "#E0E0E0"
  camera-escuro: "#263238"
  camera-medio: "#37474F"
  camera-legenda: "#cfd8dc"
typography:
  display:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  caption:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  action:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
components:
  button-primary:
    backgroundColor: "{colors.verde-recibo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.md}"
    padding: "14px"
  button-secondary:
    backgroundColor: "{colors.azul-acao}"
    textColor: "{colors.papel}"
    rounded: "{rounded.md}"
    padding: "14px"
  button-alternative:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.azul-acao}"
    rounded: "{rounded.md}"
    padding: "14px"
  button-disabled:
    backgroundColor: "{colors.linha}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.md}"
    padding: "14px"
  card:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.sm}"
    padding: "12px"
  badge-level:
    backgroundColor: "{colors.dourado-conquista}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: EcoPontos

## Overview

**Creative North Star: "O Recibo Verde"**

EcoPontos se comporta como um comprovante instantâneo de uma boa ação: cada tela confirma, com clareza de recibo, que uma reciclagem virou pontos reais. A base é enxuta e confiável — cartões brancos, bordas finas, números grandes e legíveis — porque o que está sendo comunicado (saldo, pontos ganhos, código de cupom) precisa ser lido rápido e sem ambiguidade, como um caixa eletrônico amigável.

Sobre essa base sóbria, a direção confirmada é puxar para uma expressão mais **vibrante e gamificada** nos momentos de conquista: ganhar pontos, subir de nível, resgatar uma recompensa, aparecer no ranking. É nesses instantes — não na tela inteira, o tempo todo — que o verde, o azul e principalmente o dourado devem ganhar mais presença, movimento e celebração. Telas de consulta (histórico, lixeiras, perfil) permanecem no registro "recibo": diretas, escaneáveis, sem enfeite.

**Key Characteristics:**
- Cartões brancos com borda fina de 1px sobre fundo levemente acinzentado — nunca cartões flutuando sobre branco puro.
- Um único botão de ação primária por tela sempre em verde sólido; azul é reservado para ações alternativas/secundárias (ex: "Entrar com Google").
- Números grandes (pontos, saldo) carregam mais peso visual que qualquer título de tela.
- Dourado é o único acento "de festa" — reservado a nível e conquista, nunca usado como cor de botão comum.

## Colors

Paleta é deliberadamente curta: um verde de confiança, um azul de ação secundária, um dourado de conquista, e uma escala neutra de papel a tinta. Sem paleta terciária além dessas três.

### Primary
- **Verde Recibo** (`#2E7D32`): cor de toda ação primária (botões "Entrar", "Receber Pontos", "Resgatar") e de todo valor positivo em destaque (pontos na tela Início, item ativo da navegação inferior). É a cor que diz "esta ação teve sucesso".

### Secondary
- **Azul Ação** (`#1565C0`): reservado a ações alternativas ao fluxo principal — login social, botão "Sair". Nunca compete com o verde na mesma decisão; aparece quando há uma segunda via, não uma segunda prioridade igual. Tom escurecido em relação à primeira versão do sistema (`#2196F3`) para atingir contraste WCAG AA (4.5:1) tanto em texto branco sobre fundo azul quanto em texto azul sobre fundo branco.

### Tertiary
- **Dourado Conquista** (`#FFC107`): exclusivo de badges de nível e de momentos de celebração (cupom gerado, destaque no ranking). É a única cor "de festa" do sistema — por isso não deve aparecer em botões, links ou estados de erro.

### Neutral
- **Papel** (`#FFFFFF`): fundo de cartões, do shell do app (`#app`) e da bottom nav — a superfície "sobre a qual se lê".
- **Fundo Suave** (`#F4F6F5`): fundo da página por trás do shell, cria a sensação de cartão de papel sobre uma mesa.
- **Tinta** (`#1B1B1B`): texto principal, títulos de tela, valores de destaque.
- **Tinta Suave** (`#6B6B6B`): texto de apoio — legendas, datas, saldos secundários, itens desabilitados.
- **Linha** (`#E0E0E0`): toda borda (cartões, campos, divisor da bottom nav) e o fundo de botões desabilitados.

### Superfície de Câmera (adição intencional)
- **Câmera Escuro → Câmera Médio** (`#263238` → `#37474F`, gradiente diagonal): fundo do card de simulação de câmera em Reciclar — o único momento do sistema que sai do registro "papel branco" porque está representando um visor de câmera, não um recibo.
- **Câmera Legenda** (`#cfd8dc`): texto de apoio sobre o fundo escuro do card de câmera — versão clara de `.texto-suave` para manter contraste nessa superfície invertida.

Esse trio é uma exceção deliberada e isolada (usada só nesse card), não uma segunda paleta: em qualquer outro lugar do app, a regra de papel branco + tinta escura continua valendo.

### Named Rules
**A Regra do Acento Único.** Dourado nunca é cor de botão nem de link — é reservado só a badges de nível e a momentos de celebração (cupom, ranking). Se o dourado aparecer em todo lugar, deixa de significar conquista.

**A Regra da Segunda Via.** Azul só aparece quando existe uma ação alternativa genuína à ação verde principal da tela (ex: login social); nunca como uma segunda ação de igual peso.

## Typography

**Display/Body Font:** system-ui stack (`-apple-system, "Segoe UI", Roboto, sans-serif`) — sem fontes customizadas carregadas.

**Character:** uma única família tipográfica faz todo o trabalho, com peso e tamanho — não estilo — carregando a hierarquia. Isso reforça o clima de "recibo": números e rótulos, não ornamento tipográfico.

### Hierarchy
- **Display** (700, 32px, 1.1): valor de pontos em destaque na tela Início (`#inicio-pontos`) e nome do nível no overlay de subida de nível (22px, ver Componentes) — os momentos de maior peso numérico/celebrativo do sistema.
- **Title** (700, 22px, 1.2): título de cada tela (`.titulo-tela`), incluindo o cabeçalho com botão de voltar em Reciclar/Recompensas/Lixeiras.
- **Action** (600, 16px): texto de todo botão (`.botao`) — deliberadamente maior que o Body para dar peso de ação e conforto de toque, não é um tamanho de leitura.
- **Body** (400, 15px, 1.4): texto de campos de formulário e conteúdo de cartão sem ênfase.
- **Caption** (400, 14px): `.texto-suave` — legendas, datas, metadados; quando um valor dentro de uma legenda é financeiramente relevante (ex: "Saldo: **525 pts**"), o valor usa `<strong>` em cor tinta cheia para se destacar do resto da legenda.
- **Label** (600, 13px): rótulo de badge de nível — texto dentro do badge dourado, e rótulo da bottom nav (que reaproveita o tamanho do Label sem seu peso 600, exceto no item ativo).

### Named Rules
**A Regra do Número Grande.** Qualquer valor de pontos que represente o saldo atual do usuário ganha o maior tamanho de tipografia da tela em que aparece — nunca divide protagonismo com o título.

**A Regra do Emoji-Ícone.** Emojis usados como ícone (câmera 40px em Reciclar, medalha no badge de nível e no overlay de subida de nível 56px, tiles de atalho do Início) seguem uma escala própria, fora da hierarquia de texto acima — são ilustração, não tipografia. Exceção: a bottom nav não usa mais emoji — migrou para ícones SVG de traço (ver Componentes → Ícones de Traço); qualquer expansão futura desse vocabulário de traço para outras partes do app é decisão a parte, não implícita aqui.

## Layout

Shell mobile-first de largura fixa (`max-width: 480px`, centralizado), com fundo suave por trás — o "tampo de mesa" sob o cartão de papel do app. Cada tela é uma `<section class="tela">` com padding `20px 16px 24px`; apenas uma fica visível por vez (roteamento por hash troca `display`).

Bottom navigation fixa (`#nav-bar`) presente em todas as telas pós-login, compartilhando a mesma largura máxima de 480px e ancorada ao fundo da viewport; o corpo da página reserva `padding-bottom: 72px` para nunca ficar coberto por ela.

Grade de atalhos na tela Início usa `grid-template-columns: 1fr 1fr` com `gap: 12px` — o único uso de grid no sistema hoje; cartões empilham em coluna única em todo o resto.

Ritmo de espaçamento observado: 4px (micro, gaps de ícone+texto), 8px (entre nav-item e ícone, entre botão e resultado), 12px (entre campos e cartões), 16–20px (padding de tela e cartão), 24px (fechamento inferior de tela).

## Elevation & Depth

Sistema é **flat por definição** — nenhuma `box-shadow` no código atual. Profundidade e separação vêm inteiramente de borda de 1px (`var(--borda)`) e do contraste sutil entre o branco do cartão/shell e o cinza claro do fundo da página, não de sombra.

### Named Rules
**A Regra Sem Sombra.** Nenhum elemento usa `box-shadow`. Separação de camadas é sempre borda fina + diferença de fundo, nunca elevação simulada por sombra — manter essa disciplina mesmo ao introduzir mais energia visual nos momentos de conquista.

**A Regra do Foco Visível.** Todo elemento interativo (botões, campos, cartões-link, itens da bottom nav, botão de voltar) usa o mesmo `outline` verde-recibo de 2px com 2px de distância ao receber foco por teclado — uma única linguagem de foco em todo o sistema, nunca removida sem substituição.

## Shapes

Cantos consistentemente arredondados, sem esquadria: 8px em campos de formulário, 10px em botões, 12px em cartões, e cápsula total (999px) no badge de nível — quanto mais "celebratório" o elemento, mais arredondado. Sem bordas decorativas, clipping ou recortes; a única forma não retangular do sistema é o badge de nível em cápsula.

## Components

### Buttons
- **Shape:** cantos arredondados (10px), largura total do container (`width: 100%`).
- **Primary** (`.botao`): fundo verde-recibo, texto branco, `padding: 14px`, `font-weight: 600`, `font-size: 16px`. É a única ação de uma tela na maioria dos casos.
- **Secondary** (`.botao-secundario`): mesma forma, fundo azul-ação sólido — usado quando a ação alternativa é a única ação da tela (ex: "Sair" no Perfil), sem uma ação primária verde competindo na mesma tela.
- **Alternative** (`.botao-alternativo`): contorno azul-ação sobre fundo branco (sem preenchimento sólido) — usado quando a ação alternativa aparece *ao lado* de uma ação primária verde na mesma tela (ex: "Entrar com Google" abaixo de "Entrar"), para que leia como alternativa menor, não como uma segunda opção de peso igual.
- **Disabled:** fundo linha (`#E0E0E0`), texto tinta-suave, `cursor: not-allowed` — usado no fluxo de resgate quando o saldo é insuficiente, com o próprio texto do botão informando quanto falta (ex: "Faltam 150 pts").

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** branco (papel) sobre fundo suave da página.
- **Shadow Strategy:** nenhuma — ver Elevation & Depth. Separação vem só da borda.
- **Border:** 1px sólida, cor linha; o cartão do usuário no ranking troca para borda verde de 2px quando é a linha do próprio usuário — o único caso de borda de destaque no sistema.
- **Internal Padding:** 16px, com `margin-bottom: 12px` entre cartões empilhados.

### Inputs / Fields
- **Style:** fundo branco, borda 1px cor linha, cantos 8px, `padding: 12px`, `font-size: 15px`.
- **Focus:** contorno verde-recibo de 2px com 2px de distância (`outline`, nunca `box-shadow`) e a borda também muda para verde — mesmo tratamento de foco usado em botões, cartões-link e itens da bottom nav.
- **Error:** sem validação real implementada — login, cadastro e simulação de QR aceitam qualquer entrada por design (ver PRODUCT.md), então não há estado de erro de formulário a desenhar hoje.

### Navigation
- **Bottom nav bar:** fixa, fundo branco, borda superior de 1px; quatro itens (Início, Histórico, Ranking, Perfil), cada um com ícone SVG de traço (20×20px, `stroke-width: 1.8`, `currentColor`) + rótulo de 13px empilhados verticalmente, com área de toque mínima de 44×44px.
- **Estado ativo:** ícone e texto mudam para verde-recibo, texto com `font-weight: 600` e ícone com `stroke-width: 2.2` (traço ligeiramente mais grosso); estado inativo usa tinta-suave. Sem indicador adicional (barra, ponto ou fundo) além dessas mudanças.

### Ícones de Traço (adição intencional, escopo: bottom nav)
Os quatro ícones da bottom nav (casa, relógio-histórico, troféu, pessoa) são SVGs próprios em traço único (`stroke`, sem preenchimento, `stroke-linecap`/`stroke-linejoin: round`), não emojis — a única parte do sistema que já migrou para um vocabulário de ícone real. `currentColor` faz o ícone herdar a cor do estado ativo/inativo sem CSS extra. O resto do app (badge de nível, tiles de atalho do Início, card de câmera) ainda usa emoji como ícone; migrar esses pontos é uma decisão futura em aberto, não decidida aqui.
- **Botão de voltar** (`.botao-voltar`): quadrado de 44×44px com borda fina e seta, usado no cabeçalho das telas alcançadas só a partir do Início (Reciclar, Recompensas, Lixeiras) para permitir retorno direto sem depender da bottom nav.

### Badge de Nível
Cápsula dourada compacta que envolve emoji de medalha + nome do nível (🥉 Bronze / 🥈 Prata / 🥇 Ouro). É o elemento de origem para todo o vocabulário "de festa" do sistema.

### Overlay de Subida de Nível
Modal centralizado com borda dourada de 2px (sem sombra, seguindo a Regra Sem Sombra), emoji de medalha ampliado, nome do novo nível em Display (22px/700) e um botão "Continuar" que recebe foco automático. Fecha por clique no botão, clique fora, ou Esc. É a expressão "vibrante e gamificada" do badge de nível no instante em que ele muda — não um componente novo, uma ampliação temporária do mesmo vocabulário.

### Callout de Pontos Ganhos
Texto flutuante "+N pts" em verde-recibo que sobe e desaparece sobre o card de pontos da tela Início, acompanhado de um pulso de escala no número principal, disparado sempre que `receberPontos()` é confirmado. É a versão "menor" da mesma linguagem de celebração, para o momento mais frequente do loop (ganhar pontos) em vez do mais raro (subir de nível).

## Do's and Don'ts

### Do:
- **Do** usar `.botao-alternativo` (contorno, sem preenchimento) quando uma ação alternativa aparece ao lado de uma ação primária verde na mesma tela; reservar `.botao-secundario` (preenchimento sólido azul) para quando a ação alternativa é a única ação da tela.
- **Do** usar verde-recibo para toda ação primária e para todo valor positivo de pontos em destaque.
- **Do** reservar dourado-conquista exclusivamente a badge de nível e a momentos de celebração (cupom, ranking) — é o "acento único" do sistema.
- **Do** manter separação de camadas por borda de 1px + contraste de fundo, nunca por `box-shadow`.
- **Do** manter telas de consulta (histórico, lixeiras, perfil) no registro "recibo": diretas, sem ornamento, número e rótulo lado a lado.
- **Do** concentrar energia visual gamificada (cor mais viva, movimento, celebração) nos momentos de conquista — ganhar pontos, subir de nível, gerar cupom, aparecer no ranking — não na interface como um todo.

### Don't:
- **Don't** usar dourado-conquista em botões, links ou estados de erro — isso dilui seu significado de conquista.
- **Don't** dar ao azul-ação o mesmo peso do verde-recibo numa mesma tela; ele só aparece como via alternativa, nunca como segunda ação de prioridade igual.
- **Don't** introduzir sombra (`box-shadow`) para simular elevação — a disciplina flat do sistema depende de borda, não de sombra.
- **Don't** apresentar qualquer dado do mockup (usuário, lixeiras, histórico, ranking) como real em material derivado — são dados fictícios definidos em `docs/superpowers/specs/2026-08-08-ecopontos-design.md`.
