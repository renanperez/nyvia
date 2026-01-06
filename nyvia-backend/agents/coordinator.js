const metricsAnalyst = require('./metricsAnalyst');

class Coordinator {
  async process(message, history) {
    const response = await metricsAnalyst.execute(message, history);
    return { content: response.content };
  }

  async processStream(message, history, onChunk) {
    await metricsAnalyst.executeStream(message, history, onChunk);
  }
}

module.exports = new Coordinator();

// process: método original (sem streaming)
// processStream: novo método que recebe callback onChunk
// onChunk: função chamada a cada pedaço de texto gerado