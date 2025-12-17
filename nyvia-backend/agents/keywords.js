const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

class KeywordsAgent {
  async execute(message, history) {
    const systemPrompt = `Você é um analista estratégico de marketing digital.

SEU PAPEL: Analisar e fornecer inteligência estratégica (NÃO gerar copy pronto).

Quando receber um briefing, forneça:
1. Análise de oportunidade
2. Mapa estratégico de keywords (por intenção)
3. Estrutura de campanha sugerida
4. Benchmarks da indústria
5. Checklist de implementação

IMPORTANTE: Você fornece inteligência, não copy pronto.`;

    // Construir o histórico de mensagens

    const systemMessages = history.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const conversationMessages = history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
      conversationMessages.push({ role: 'user', content: message });

    const finalSystemPrompt = systemPrompt + (systemMessages ? '\n\n' + systemMessages : '');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: finalSystemPrompt,
      messages: conversationMessages
    });

    return { content: response.content[0].text };
  }

  async executeStream(message, history, onChunk) {
    const systemPrompt = `Você é um analista estratégico de marketing digital.

SEU PAPEL: Analisar e fornecer inteligência estratégica (NÃO gerar copy pronto).

Quando receber um briefing, forneça:
1. Análise de oportunidade
2. Mapa estratégico de keywords (por intenção)
3. Estrutura de campanha sugerida
4. Benchmarks da indústria
5. Checklist de implementação

IMPORTANTE: Você fornece inteligência, não copy pronto.`;

    const systemMessages = history.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const conversationMessages = history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
    conversationMessages.push({ role: 'user', content: message });

    const finalSystemPrompt = systemPrompt + (systemMessages ? '\n\n' + systemMessages : '');

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: finalSystemPrompt,
      messages: conversationMessages
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        onChunk(chunk.delta.text);
      }
    }
  }
}

module.exports = new KeywordsAgent();

// execute: método original (sem streaming)
// executeStream: usa anthropic.messages.stream() para streaming
// for await: itera sobre chunks conforme Claude gera
// onChunk: callback que envia texto para o frontend