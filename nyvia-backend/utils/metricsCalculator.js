/**
 * Calculadora de Métricas de Marketing Digital
 * Replica exatamente os cálculos da planilha Revenue_Growth.xlsx
 * Ordem de execução: D4 → F4 → G4 → ... → AP4 → Status
 */

/**
 * Valida se todas as variáveis necessárias estão preenchidas
 */
function validarEntradas(variaveis) {
  const obrigatorias = [
    'orcamento',
    'budgetAlocado',
    'percentualDisplay',
    'percentualSearch',
    'impressoesPorRealDisplay',
    'impressoesPorRealSearch',
    'ctrDisplay',
    'ctrSearch',
    'sessoesPorUsuario',
    'taxaConversao',
    'ticketMedio',
    'cogsPercentual',
    'customerLifespan'
  ];

  const faltantes = [];
  
  for (const campo of obrigatorias) {
    if (variaveis[campo] === null || variaveis[campo] === undefined) {
      faltantes.push(campo);
    }
  }

  if (faltantes.length > 0) {
    return {
      valido: false,
      faltantes: faltantes
    };
  }

  // Validações de tipo e range
  if (typeof variaveis.orcamento !== 'number' || variaveis.orcamento <= 0) {
    return { valido: false, erro: 'Orçamento deve ser número positivo' };
  }

  if (variaveis.percentualDisplay + variaveis.percentualSearch !== 1) {
    return { valido: false, erro: 'Soma de Display% + Search% deve ser 100%' };
  }

  return { valido: true };
}

/**
 * Calcula todas as métricas seguindo ordem exata da planilha
 * @param {number} orcamento - Orçamento total da campanha
 * @param {Object} variaveis - Variáveis necessárias para cálculo
 * @returns {Object} Métricas calculadas em 5 blocos
 */
function calcularMetricas(orcamento, variaveis) {
  // Validação obrigatória
  const validacao = validarEntradas({ ...variaveis, orcamento });
  if (!validacao.valido) {
    throw new Error(`Validação falhou: ${validacao.erro || `Faltam: ${validacao.faltantes.join(', ')}`}`);
  }

  const {
    budgetAlocado,
    percentualDisplay,
    percentualSearch,
    impressoesPorRealDisplay,
    impressoesPorRealSearch,
    ctrDisplay,
    ctrSearch,
    sessoesPorUsuario,
    taxaConversao,
    ticketMedio,
    cogsPercentual,
    customerLifespan,
    periodo = 1 // C4 - período em meses (padrão 1)
  } = variaveis;

  // ====================================
  // BLOCO 1: DISPLAY ADS
  // ====================================
  
  // F4: Ad Spend
  const adSpend = orcamento * budgetAlocado;
  
  // G4: Display Budget
  const displayBudget = adSpend * percentualDisplay;
  
  // H4: Impressões Display
  const displayImpressoes = displayBudget * impressoesPorRealDisplay;
  
  // I4: Cliques Display
  const displayCliques = displayImpressoes * ctrDisplay;
  
  // J4: CPM (Custo por Mil Impressões)
  const displayCPM = displayImpressoes > 0 ? (displayBudget / displayImpressoes) * 1000 : 0;
  
  // K4: CTR Display (já é input, mas calculamos para validação)
  const displayCTRCalculado = displayImpressoes > 0 ? displayCliques / displayImpressoes : 0;

  // ====================================
  // BLOCO 2: SEARCH ADS
  // ====================================
  
  // L4: Search Budget
  const searchBudget = adSpend * percentualSearch;
  
  // M4: Impressões Search
  const searchImpressoes = searchBudget * impressoesPorRealSearch;
  
  // N4: Cliques Search
  const searchCliques = searchImpressoes * ctrSearch;
  
  // O4: CPC (Custo por Clique)
  const searchCPC = searchCliques > 0 ? searchBudget / searchCliques : 0;
  
  // P4: CTR Search (já é input, mas calculamos para validação)
  const searchCTRCalculado = searchImpressoes > 0 ? searchCliques / searchImpressoes : 0;

  // ====================================
  // BLOCO 3: VISITANTES E CONVERSÕES
  // ====================================
  
  // R4: Total Visitantes/Usuários
  const totalVisitantes = displayCliques + searchCliques;
  
  // S4: Sessões
  const totalSessoes = totalVisitantes * sessoesPorUsuario;
  
  // T4: Sessões por Usuário (validação)
  const sessoesPorUsuarioCalculado = totalVisitantes > 0 ? totalSessoes / totalVisitantes : 0;
  
  // U4: Novos Pedidos
  const novosPedidos = totalVisitantes * taxaConversao;
  
  // V4: Taxa de Conversão (validação)
  const taxaConversaoCalculada = totalVisitantes > 0 ? novosPedidos / totalVisitantes : 0;

  // ====================================
  // BLOCO 4: RECEITA E ROI
  // ====================================
  
  // Z4: Clientes Adquiridos
  const clientesAdquiridos = novosPedidos;
  
  // AB4: Total de Vendas
  const totalVendas = ticketMedio * clientesAdquiridos;
  
  // Q4: ROAS (Return on Ad Spend)
  const roas = adSpend > 0 ? totalVendas / adSpend : 0;
  
  // X4: Receita - Investimento
  const receitaLiquida = totalVendas - adSpend;
  
  // Y4: ROI (%)
  const roi = adSpend > 0 ? receitaLiquida / adSpend : 0;
  
  // AC4: Diferença
  const diferenca = totalVendas - adSpend;
  
  // AD4: Variação Percentual
  const variacaoPercentual = orcamento > 0 ? diferenca / orcamento : 0;

  // ====================================
  // BLOCO 5: MÉTRICAS AVANÇADAS
  // ====================================
  
  // AE4: CAC (Custo de Aquisição por Cliente)
  const cac = clientesAdquiridos > 0 ? adSpend / clientesAdquiridos : 0;
  
  // AF4: Revenue Per Customer (RPC)
  const revenuePerCustomer = clientesAdquiridos > 0 ? (totalVendas * periodo) / clientesAdquiridos : 0;
  
  // AG4: COGS (Custo dos Produtos Vendidos)
  const cogs = revenuePerCustomer * cogsPercentual;
  
  // AH4: Lucro Bruto por Cliente
  const lucroBrutoPorCliente = revenuePerCustomer - cogs;
  
  // AI4: Margem de Lucro Bruta
  const margemLucroBruta = revenuePerCustomer > 0 ? lucroBrutoPorCliente / revenuePerCustomer : 0;
  
  // AJ4: AOV (Average Order Value)
  const aov = novosPedidos > 0 ? totalVendas / novosPedidos : 0;
  
  // AK4: APF (Average Purchase Frequency)
  const apf = novosPedidos > 0 ? clientesAdquiridos / novosPedidos : 0;
  
  // AM4: CLTV (Customer Lifetime Value)
  const cltv = aov * apf * customerLifespan;
  
  // AN4: Lucro do Cliente ao Longo da Vida
  const lucroLifetime = cltv - cogs;
  
  // AO4: Break Even CAC
  const breakEvenCAC = cltv * margemLucroBruta;
  
  // AP4: LTV/CAC Ratio
  const ltvCacRatio = cac > 0 ? cltv / cac : 0;
  
  // W4: Break Even ROAS
  const breakEvenROAS = margemLucroBruta > 0 ? 1 / margemLucroBruta : 0;

  // ====================================
  // STATUS FINAL (Coluna AQ)
  // ====================================
  
  let status = '';
  if (ltvCacRatio >= 4) {
    status = 'Excellent margin for reinvestment';
  } else if (ltvCacRatio >= 3) {
    status = 'Healthy profitability';
  } else if (ltvCacRatio >= 2) {
    status = 'Modest profitability';
  } else {
    status = 'Loss (CAC above gross margin)';
  }

  // ====================================
  // RETORNO ESTRUTURADO EM 5 BLOCOS
  // ====================================
  
  return {
    bloco1_displayAds: {
      budgetAlocado: displayBudget,
      impressoes: displayImpressoes,
      cliques: displayCliques,
      cpm: displayCPM,
      ctr: displayCTRCalculado
    },
    bloco2_searchAds: {
      budgetAlocado: searchBudget,
      impressoes: searchImpressoes,
      cliques: searchCliques,
      cpc: searchCPC,
      ctr: searchCTRCalculado
    },
    bloco3_conversao: {
      totalVisitantes: totalVisitantes,
      totalSessoes: totalSessoes,
      sessoesPorUsuario: sessoesPorUsuarioCalculado,
      novosPedidos: novosPedidos,
      taxaConversao: taxaConversaoCalculada
    },
    bloco4_receitaROI: {
      clientesAdquiridos: clientesAdquiridos,
      totalVendas: totalVendas,
      roas: roas,
      receitaLiquida: receitaLiquida,
      roi: roi,
      diferenca: diferenca,
      variacaoPercentual: variacaoPercentual
    },
    bloco5_metricasAvancadas: {
      cac: cac,
      revenuePerCustomer: revenuePerCustomer,
      cogs: cogs,
      lucroBrutoPorCliente: lucroBrutoPorCliente,
      margemLucroBruta: margemLucroBruta,
      aov: aov,
      apf: apf,
      cltv: cltv,
      lucroLifetime: lucroLifetime,
      breakEvenCAC: breakEvenCAC,
      ltvCacRatio: ltvCacRatio,
      breakEvenROAS: breakEvenROAS,
      status: status
    }
  };
}

/**
 * Formata número como moeda brasileira
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata número como percentual
 */
function formatarPercentual(valor, casasDecimais = 1) {
  return `${(valor * 100).toFixed(casasDecimais)}%`;
}

/**
 * Formata número com separadores de milhar
 */
function formatarNumero(valor, casasDecimais = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor);
}

module.exports = {
  calcularMetricas,
  validarEntradas,
  formatarMoeda,
  formatarPercentual,
  formatarNumero
};