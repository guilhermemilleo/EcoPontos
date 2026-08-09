# EcoPontos — Mockup Clicável

**Data:** 2026-08-08
**Status:** Aprovado para planejamento

## 1. Visão geral

EcoPontos é um mockup clicável (protótipo estático, não funcional) de um app que recompensaria usuários por reciclar materiais em lixeiras inteligentes. O objetivo é demonstrar o fluxo completo — escanear QR Code de uma lixeira, ganhar pontos, resgatar recompensas, ver histórico e ranking — sem nenhum backend real por trás.

Não há autenticação real, banco de dados real, nem leitura de câmera real. Todo o estado (usuário, pontos, histórico) vive em um objeto JavaScript em memória, criado do zero a cada carregamento da página. Login, cadastro e leitura de QR Code são simulados: qualquer interação "funciona" e avança o fluxo, sem validar nada de verdade.

## 2. Arquitetura

- **Stack:** HTML + CSS + JavaScript puro. Sem framework, sem build step, sem dependências de backend.
- **Navegação:** hash routing (`#/inicio`, `#/reciclar`, etc.) — um script mostra/esconde a `<section>` correspondente ao hash atual. Dá URLs navegáveis e funciona com o botão voltar do navegador.
- **Estado:** um único objeto JS em memória (`state`), populado com dados fake no carregamento e atualizado pelas interações do usuário (ex: resgatar uma recompensa debita `state.pontos`). Nada persiste entre reloads.
- **QR Code do cupom:** biblioteca JS leve para geração de QR Code (ex: `qrcode.js`), carregada via CDN.

## 3. Dados fake (em memória)

Sem coleções de banco — objetos JS fixos, carregados no início:

```js
state = {
  usuario: { nome, fotoUrl, pontos, pontosTotais },
  lixeirasTeste: [
    { id, endereco, itens: [{ material, quantidade }] },
    // 3–4 lixeiras pré-definidas com combinações diferentes
  ],
  recompensas: [
    { titulo, custoPontos, tipo },
    // catálogo fixo, ver seção 4
  ],
  historico: [
    { data, itens: [{ material, quantidade, pontosGanhos }], totalPontos },
    // 3–5 reciclagens fake pré-populadas
  ],
  ranking: [
    { nome, pontos },
    // ~8 usuários fake fixos; a posição do usuário atual é calculada e inserida
  ],
  resgates: [], // populado em memória conforme o usuário resgata recompensas na sessão
}
```

Toda "ação" (login, simular leitura de QR, resgatar) só atualiza `state` e navega para a próxima tela — nenhuma validação real de senha, nenhuma escrita em banco.

## 4. Regras de negócio (mantidas do conceito original, aplicadas em memória)

**Pontos por material:**
| Material | Pontos/unidade |
|---|---|
| PET | 10 |
| Alumínio/Lata | 15 |
| Papel | 20 |

**Níveis** (por `pontosTotais` — não decresce com resgates):
| Nível | Faixa |
|---|---|
| 🥉 Bronze | 0 – 999 |
| 🥈 Prata | 1.000 – 4.999 |
| 🥇 Ouro | 5.000+ |

**Catálogo de recompensas:**
| Recompensa | Custo |
|---|---|
| 5% de desconto | 300 pts |
| 10% de desconto | 600 pts |
| Cupom R$20 | 1.000 pts |
| Vale-compras R$50 | 2.000 pts |

**Fluxo de resgate:** valida saldo (`state.usuario.pontos`) suficiente → debita de `pontos` (não afeta `pontosTotais`/nível) → cria registro em `state.resgates` com código fake `ECO-XXXXXX` e validade fake de 30 dias a partir do momento do resgate.

## 5. Telas e rotas

| Rota | Tela | Comportamento no mockup |
|---|---|---|
| `#/login` | Login | Formulário fake (email/senha) — qualquer entrada "loga" e vai para `#/inicio`. Botão Google também loga direto. Link para cadastro. |
| `#/cadastro` | Criar conta | Formulário fake — "criar conta" também loga direto e vai para `#/inicio`. |
| `#/inicio` | Início | Saudação, pontos e nível do usuário fake, atalhos para as outras telas. |
| `#/reciclar` | Reciclar | Tela de câmera fake (visual estático, sem acesso real à câmera) + botão **"Simular leitura de QR"**, que cicla entre as lixeiras de teste a cada clique. Mostra itens lidos e pontos a ganhar, com botão "Receber Pontos" que soma ao saldo em `state`. |
| `#/recompensas` | Recompensas | Catálogo fixo + saldo atual. Botão "Resgatar" desabilitado (com indicação do quanto falta) se saldo insuficiente; senão, resgata e navega para `#/cupom/:id`. |
| `#/cupom/:id` | Cupom | QR Code gerado a partir do código fake, mais o código `ECO-XXXXXX` e a validade (30 dias a partir do resgate). |
| `#/historico` | Histórico | Lista fixa de reciclagens (pré-populada + as feitas na sessão) e totais agregados por material. |
| `#/ranking` | Ranking | Top 10 fake; destaca a posição do usuário atual, mesmo se fora do top 10. |
| `#/perfil` | Perfil | Nome, foto, nível, pontos do usuário fake, configurações (placeholder), botão "Sair" volta para `#/login`. |
| `#/lixeiras` | Lixeiras | Lista das lixeiras de teste com endereço fake. |

**Navegação:** bottom navigation bar fixa (mobile) com Início, Histórico, Ranking, Perfil, presente em todas as telas pós-login.

**Tratamento de "erro":** único caso mantido é o botão de resgate desabilitado por saldo insuficiente — puramente visual, sem lógica de erro real (não há câmera real nem senha real para falhar).

## 6. Identidade visual

- 🟢 Verde primário: `#2E7D32`
- 🔵 Azul secundário: `#2196F3`
- ⚪ Branco (fundo): `#FFFFFF`
- 🟡 Dourado (destaque/nível Ouro, badges): `#FFC107`

Layout mobile-first, responsivo.

## 7. Fora de escopo

- Autenticação real, banco de dados real, persistência entre sessões
- Leitura de câmera real / acesso a `getUserMedia`
- PWA instalável (manifest, service worker)
- Mapa interativo real
- Painel administrativo
- Testes automatizados

Tudo isso fica para uma fase futura, caso o mockup seja aprovado e se decida construir o app funcional de verdade.

## 8. Testes

Apenas manual: percorrer o fluxo completo (login → simular leitura de QR → ganhar pontos → resgatar recompensa → ver cupom → conferir histórico e ranking atualizados), verificando em viewport mobile (estreito) e desktop.

## 9. Deploy

Publicação como site estático (pasta com `index.html`, CSS, JS) em GitHub Pages ou Netlify — sem build step, é literalmente subir os arquivos. Objetivo é gerar um link compartilhável para visualização em qualquer dispositivo, incluindo celular.
