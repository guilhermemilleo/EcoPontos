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
