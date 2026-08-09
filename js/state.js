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

function simularLeituraLixeira(forcarLixeiraId) {
  const lixeiraForcada = forcarLixeiraId && state.lixeirasTeste.find((l) => l.id === forcarLixeiraId);
  let lixeira = lixeiraForcada;

  if (!lixeira) {
    lixeira = state.lixeirasTeste[state.proximaLixeiraIndex];
    state.proximaLixeiraIndex = (state.proximaLixeiraIndex + 1) % state.lixeirasTeste.length;
  }

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
