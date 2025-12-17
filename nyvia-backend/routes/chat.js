const authMiddleware = require('../middleware/auth');
const express = require('express');
const db = require('../config/database');
const coordinator = require('../agents/coordinator');
const { readArtifactContent } = require('../utils/fileReader');

const router = express.Router();
router.use(authMiddleware);
// Middleware de autenticação

router.post('/', async (req, res) => { // Rota para processar mensagens do usuário
  console.log('🔵 REQUISIÇÃO CHEGOU NO HANDLER');
  console.log('📦 Body:', req.body);
  try {
    const { workspaceId, conversationId, message } = req.body;
    console.log('🔍 Buscando workspace:', workspaceId);
    const workspace = db.getWorkspaceById(workspaceId);
    console.log('🗂️ Workspace:', workspace);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace não encontrado' });
    }
    let convId = conversationId || db.createConversation(workspaceId);
    db.addMessage(convId, 'user', message);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Buscar histórico da conversa
    const history = db.getConversationHistory(convId);
    let fullResponse = '';

    // Buscar e ler artifacts do workspace
    const artifacts = db.getArtifactsByWorkspace(workspaceId);
    let artifactsContext = '';

      console.log('📄 Artifacts encontrados:', artifacts.length)

    if (artifacts.length > 0) {
      artifactsContext = '\n\n=== DOCUMENTOS DO CLIENTE ===\n';
      for (const artifact of artifacts) {
        const content = await readArtifactContent(artifact.file_path, artifact.file_type);
        if (content) {
          artifactsContext += `\n[${artifact.original_name}]\n${content}\n`;
        }
      }
      console.log('📄 Preview context:', artifactsContext.substring(0, 200))
    }

    // Adicionar artifacts ao histórico
    if (artifactsContext) {
      history.push({
        role: 'system',
        content: artifactsContext
      });
    }

    // Processar mensagem com streaming
    await coordinator.processStream(message, history, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Salvar resposta completa no banco de dados
    db.addMessage(convId, 'assistant', fullResponse);
    res.write(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    res.write(`data: ${JSON.stringify({ error: 'Erro ao processar mensagem' })}\n\n`);
    res.end();
  }
});

module.exports = router;