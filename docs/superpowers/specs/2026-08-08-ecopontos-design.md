# EcoPontos — Design

**Data:** 2026-08-08
**Status:** Aprovado para planejamento

## 1. Visão geral

EcoPontos é um webapp (PWA instalável) que recompensa usuários por reciclar materiais em lixeiras inteligentes. O usuário escaneia o QR Code de uma lixeira, o sistema registra os materiais reciclados, credita pontos, e permite resgatar recompensas (descontos, cupons, vale-compras) geradas como QR Codes com validade de 30 dias. Inclui histórico de reciclagem, ranking de usuários e perfil.

Este é um app funcional real (não um protótipo mockado): autenticação real, banco de dados real, leitura de QR Code via câmera real. Como não existem lixeiras físicas com QR Code ainda, o MVP usa um conjunto de QR Codes de teste pré-cadastrados no banco, cada um mapeado para uma combinação fixa de materiais/quantidades — simulando lixeiras reais sem depender de hardware.

## 2. Arquitetura

- **Frontend:** React + Vite, PWA instalável (`vite-plugin-pwa`: manifest + service worker), mobile-first, responsivo.
- **Backend/infra:** Firebase
  - **Authentication:** email/senha + Google (OAuth)
  - **Firestore:** banco de dados principal
  - **Hosting:** Firebase Hosting para deploy
- **Leitura de QR Code:** `html5-qrcode` (acesso à câmera do navegador via `getUserMedia`)
- **Geração de QR Code de cupom:** `qrcode.react`
- **Roteamento:** React Router — rotas protegidas exigem sessão autenticada
- **Estado:** Context API + hooks (escopo não justifica Redux/Zustand)

## 3. Modelo de dados (Firestore)

**`users/{uid}`**
```
nome: string
email: string
fotoUrl: string
pontos: number          // saldo atual (disponível para resgate)
pontosTotais: number    // acumulado histórico (define o nível)
criadoEm: timestamp
```

**`lixeiras/{codigoQR}`** — dados de teste, pré-cadastrados
```
localizacao: { endereco: string, lat: number, lng: number }
itensPadrao: [{ material: string, quantidade: number }]
```

**`reciclagens/{id}`** — histórico de leituras confirmadas
```
uid: string
data: timestamp
itens: [{ material: string, quantidade: number, pontosGanhos: number }]
totalPontos: number
```

**`recompensas/{id}`** — catálogo fixo (seed inicial)
```
titulo: string
custoPontos: number
tipo: "desconto" | "cupom" | "vale"
```

**`resgates/{id}`** — cupom gerado ao resgatar uma recompensa
```
uid: string
recompensaId: string
codigo: string          // formato ECO-XXXXXX
geradoEm: timestamp
validadeEm: timestamp   // geradoEm + 30 dias
usado: boolean
```

**Ranking:** não é uma coleção própria — query em `users` ordenada por `pontos` (ou `pontosTotais`), limitada a 10.

## 4. Regras de negócio

**Pontos por material** (derivados dos exemplos do mockup original):
| Material | Pontos/unidade |
|---|---|
| PET | 10 |
| Alumínio/Lata | 15 |
| Papel | 20 |

**Níveis** (por `pontosTotais` acumulado — nunca decresce com resgates):
| Nível | Faixa |
|---|---|
| 🥉 Bronze | 0 – 999 |
| 🥈 Prata | 1.000 – 4.999 |
| 🥇 Ouro | 5.000+ |

**Catálogo de recompensas inicial:**
| Recompensa | Custo |
|---|---|
| 5% de desconto | 300 pts |
| 10% de desconto | 600 pts |
| Cupom R$20 | 1.000 pts |
| Vale-compras R$50 | 2.000 pts |

**Fluxo de resgate:** valida saldo (`pontos`) suficiente → debita de `pontos` (não afeta `pontosTotais`/nível) → cria documento em `resgates` com código único `ECO-XXXXXX` e validade de 30 dias a partir da geração.

## 5. Telas e rotas

| Rota | Tela | Acesso |
|---|---|---|
| `/login` | Login (email/senha, Google, link cadastro) | Pública |
| `/cadastro` | Criar conta | Pública |
| `/` | Início — saudação, pontos, nível, navegação principal | Protegida |
| `/reciclar` | Escaneia QR da lixeira → exibe itens lidos e pontos → "Receber Pontos" | Protegida |
| `/recompensas` | Saldo + catálogo de recompensas, botão Resgatar | Protegida |
| `/cupom/:id` | Tela de sucesso: QR Code do cupom, código, validade | Protegida |
| `/historico` | Lista de reciclagens + totais agregados por material | Protegida |
| `/ranking` | Top 10 por pontos; destaca posição do usuário se fora do top 10 | Protegida |
| `/perfil` | Nome, foto, nível, pontos, configurações (placeholder), sair | Protegida |
| `/lixeiras` | Lista de lixeiras de teste cadastradas com endereço | Protegida |

**Navegação:** bottom navigation bar fixa (mobile) com Início, Histórico, Ranking, Perfil, presente em todas as rotas protegidas.

**Tratamento de erros:**
- QR Code não reconhecido (não existe em `lixeiras`) → mensagem de erro, permite tentar novamente
- Permissão de câmera negada → instrução de como habilitar nas configurações do navegador
- Falha de login/cadastro → mensagem de erro inline no formulário
- Saldo insuficiente para resgate → botão "Resgatar" desabilitado com indicação do quanto falta

## 6. Identidade visual

- 🟢 Verde primário: `#2E7D32`
- 🔵 Azul secundário: `#2196F3`
- ⚪ Branco (fundo): `#FFFFFF`
- 🟡 Dourado (destaque/nível Ouro, badges): `#FFC107`

## 7. Fora de escopo (MVP)

- Mapa interativo real (Google Maps API) — usamos lista simples de lixeiras cadastradas
- Painel administrativo para gerenciar recompensas/lixeiras (catálogo é seed fixo)
- Validação de uso do cupom em loja física (campo `usado` existe no modelo, mas não há fluxo de quem marca)
- Geolocalização em tempo real do usuário

## 8. Testes

- Testes unitários das regras de pontuação e cálculo de nível (funções puras)
- Testes de componente para os formulários (login, cadastro, resgate)
- Teste manual do fluxo completo: login → escanear QR de teste → ganhar pontos → resgatar recompensa → ver cupom → conferir histórico e ranking atualizados

## 9. Deploy

Firebase Hosting, com projeto Firebase configurado para Authentication (email/senha + Google) e Firestore.
