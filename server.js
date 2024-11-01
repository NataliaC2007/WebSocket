const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3002 });
const clientes = new Map();

server.on('connection', (ws) => {
  let isRegistered = false;

  const askForUsername = () => {
    ws.send('Digite seu nome de usuário:');
  };

  askForUsername();

  ws.on('message', (mensagem) => {
    if (!isRegistered) {
      if (Array.from(clientes.values()).includes(mensagem)) {
        ws.send('Nome de usuário já em uso. Por favor, escolha outro.');
        return;
      }
      
      clientes.set(ws, mensagem);
      isRegistered = true;
      enviarMensagemParaTodos(`${mensagem} entrou no chat!`);
      atualizarListaUsuarios();
    } else {
      enviarMensagemParaTodos(`${clientes.get(ws)}: ${mensagem}`);
    }
  });

  ws.on('close', () => {
    const usuario = clientes.get(ws);
    if (usuario) {
      clientes.delete(ws);
      enviarMensagemParaTodos(`${usuario} saiu do chat.`);
      atualizarListaUsuarios();
    }
  });
});

function enviarMensagemParaTodos(mensagem) {
  clientes.forEach((_, cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensagem);
    }
  });
}

function atualizarListaUsuarios() {
  const usuariosConectados = Array.from(clientes.values()).join(', ');
  enviarMensagemParaTodos(`Usuários conectados: ${usuariosConectados}`);
}
