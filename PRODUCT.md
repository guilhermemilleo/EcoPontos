# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML + CSS + JavaScript puro (vanilla), sem framework e sem build step. Hash routing implementado manualmente (`js/router.js`); estado em memória (`js/state.js`); dados fake (`js/data.js`); renderização (`js/render.js`). Deploy previsto como site estático (GitHub Pages ou Netlify).

## Users

Morador urbano comum que já recicla ou gostaria de reciclar no dia a dia, perto de casa ou do trabalho, e é motivado a manter o hábito por receber recompensas tangíveis (descontos, cupons, vale-compras) ao usar lixeiras inteligentes espalhadas pela cidade.

## Product Purpose

EcoPontos recompensa quem recicla em lixeiras inteligentes: o usuário escaneia o QR Code de uma lixeira ao depositar materiais, ganha pontos proporcionais ao material reciclado, acumula nível (Bronze/Prata/Ouro) e troca pontos por recompensas (descontos, cupons, vale-compras). Sucesso = tornar reciclagem uma ação com retorno imediato e visível, aumentando a frequência com que as pessoas reciclam.

## Positioning

Mecanismo diferenciador: recompensa instantânea e gamificada atrelada ao ato físico de reciclar em uma lixeira inteligente específica (via QR Code), não um app genérico de educação ambiental ou de logística de coleta. O elo direto "reciclou → escaneou → ganhou pontos → resgatou" é o que um concorrente sem rede de lixeiras inteligentes não replicaria com a mesma imediatismo.

## Operating Context

Este repositório é, no momento, um **mockup clicável (protótipo estático, não funcional)** — sem backend real, autenticação real, banco de dados real ou leitura de câmera real. Todo o estado vive em memória e é recriado a cada carregamento da página.

O projeto existe para **apresentação/pitch a avaliadores ou investidores** (a estrutura do repositório reflete isso — pasta "App Shark Tank"). O objetivo imediato é demonstrar o fluxo completo de forma navegável e visualmente convincente, não validar tecnicamente o produto. Uso real esperado da demo: em navegador desktop e mobile, percorrendo o fluxo login → simular leitura de QR → ganhar pontos → resgatar recompensa → ver cupom → conferir histórico e ranking.

Fluxos/telas cobertos pelo mockup: login/cadastro (fake), início, reciclar (simulação de leitura de QR), recompensas (catálogo + resgate), cupom (QR Code gerado + código), histórico, ranking, perfil, lixeiras cadastradas. Navegação por bottom nav bar fixa em mobile.

## Capabilities and Constraints

- Sem autenticação real, banco de dados real ou persistência entre sessões — tudo reseta a cada reload.
- Sem leitura de câmera real (`getUserMedia`) — a leitura de QR Code é simulada por um botão que cicla entre lixeiras de teste pré-definidas.
- Sem PWA instalável, sem mapa interativo real, sem painel administrativo, sem testes automatizados — fora de escopo do mockup atual.
- Regras de negócio (pontos por material, faixas de nível, catálogo de recompensas, validade de cupom) já definidas no spec de design (`docs/superpowers/specs/2026-08-08-ecopontos-design.md`) e devem ser preservadas como verdade de produto ao evoluir a UI.
- Modelo de negócio e parceiros (quem paga as recompensas, quem instala/opera as lixeiras inteligentes) **ainda não definidos** — não inventar parcerias, marcas ou termos comerciais específicos em telas futuras.

## Brand Commitments

Nome do produto: **EcoPontos**. Sem outros compromissos de marca (voz, ativos, personalidade) confirmados além do nome.

## Evidence on Hand

Nenhuma evidência real (dados de usuários reais, parceiros, testemunhos, dados de coleta) existe hoje — todos os dados no mockup (usuário, lixeiras, histórico, ranking) são fictícios e não devem ser apresentados como reais em nenhum material derivado. Não fabricar depoimentos, métricas de adoção ou parcerias.

## Product Principles

1. O elo entre ação física de reciclar e recompensa deve ser sempre o mais curto e visível possível — cada tela reforça esse ciclo.
2. O mockup deve parecer e navegar como um produto real, mesmo sem backend — toda simulação (login, QR, resgate) precisa ser convincente o suficiente para um pitch.
3. Preservar como verdade de produto as regras de negócio já definidas (pontuação, níveis, catálogo) ao evoluir qualquer tela; mudanças nesses números são decisão de produto, não de design.
4. Não inventar parceiros, modelo de monetização ou dados reais — manter como decisão explicitamente em aberto até ser definida.
5. Mobile-first: a maioria dos usuários reais encontraria as lixeiras inteligentes e usaria o app no celular, no local da reciclagem.

## Accessibility & Inclusion

Nenhum requisito de acessibilidade específico foi levantado até o momento; nenhuma necessidade de usuário conhecida além do público geral.
