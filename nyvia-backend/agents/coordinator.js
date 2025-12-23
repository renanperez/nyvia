const keywordsAgent = require('./keywords');
const metricsAnalyst = require('./metricsAnalyst');

class Coordinator {
  _decideAgent(message, history) {
    const msg = message.toLowerCase();
    // Palavras-chave para decidir o agente a ser usado
    const metricsWords = ['orçamento', 'budget', 'roi', 'roas', 'cac', 'ltv', 'métricas', 'metricas', 'calcular', 'campanha', 'conversão', 'conversao', 'vendas', 'receita', 'lucro'];
    const keywordsWords = ['keywords', 'palavras-chave', 'seo', 'estratégia', 'estrategia', 'briefing'];
    // Verifica se a mensagem contém palavras relacionadas a métricas ou keywords
    const hasMetrics = metricsWords.some(w => msg.includes(w));
    const hasKeywords = keywordsWords.some(w => msg.includes(w));
    const inMetricsFlow = history.some(h => h.role === 'assistant' && (h.content.includes('orçamento') || h.content.includes('Setor do negócio')));
    // Decide o agente com base na análise acima
    if (inMetricsFlow || hasMetrics) return metricsAnalyst;
    if (hasKeywords) return keywordsAgent;
    return keywordsAgent; // default
  }
  async process(message, history) {
    const agent = this._decideAgent(message, history);
    const response = await agent.execute(message, history);
    return { content: response.content };
  }

  async processStream(message, history, onChunk) {
    const agent = this._decideAgent(message, history);
    await agent.executeStream(message, history, onChunk);
  }
}

module.exports = new Coordinator();

// process: método original (sem streaming)
// processStream: novo método que recebe callback onChunk
// onChunk: função chamada a cada pedaço de texto gerado