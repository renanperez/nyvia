const Anthropic = require('@anthropic-ai/sdk');
const keywordsAgent = require('./keywords');
const metricsAnalyst = require('./metricsAnalyst');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

class Coordinator {
  async _decidirAgente(message, history) {
    // Verifica histórico primeiro (economia de API)
    const historicoMetricas = history.some(m => 
      m.role === 'assistant' && 
      (m.content.includes('orçamento') || m.content.includes('Qual o setor'))
    );
    
    if (historicoMetricas) {
      return 'metrics';
    }

    // Classificação via Claude API
    const classificationPrompt = `Classifique a intenção desta mensagem em UMA categoria:

KEYWORDS: Análise estratégica de palavras-chave, SEO, estrutura de campanha, mapa de keywords
METRICS: Cálculo de métricas de campanha (ROI, CAC, LTV, orçamento, conversão, receita)

Mensagem: "${message}"

Responda APENAS: KEYWORDS ou METRICS`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: classificationPrompt }]
      });

      const classification = response.content[0].text.trim().toUpperCase();
      
      if (classification === 'METRICS') {
        return 'metrics';
      }
      
      return 'keywords';
      
    } catch (error) {
      console.error('❌ Erro na classificação:', error.message);
      return 'keywords'; // fallback
    }
  }

  async process(message, history) {
    const agente = await this._decidirAgente(message, history);
    console.log(`🎯 Coordinator: Usando agente "${agente}"`);

    if (agente === 'metrics') {
      const response = await metricsAnalyst.execute(message, history);
      return { content: response.content };
    } else {
      const response = await keywordsAgent.execute(message, history);
      return { content: response.content };
    }
  }

  async processStream(message, history, onChunk) {
    const agente = await this._decidirAgente(message, history);
    console.log(`🎯 Coordinator: Usando agente "${agente}" (stream)`);

    if (agente === 'metrics') {
      await metricsAnalyst.executeStream(message, history, onChunk);
    } else {
      await keywordsAgent.executeStream(message, history, onChunk);
    }
  }
}

module.exports = new Coordinator();