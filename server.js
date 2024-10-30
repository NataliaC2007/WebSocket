// server.js
const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
const clientes = new Map(); // Mapeia cada cliente ao seu nome de usuário

server.on("connection", (ws) => {
  // Solicita o nome de usuário assim que o cliente se conecta
  ws.send("Envie seu nome de usuário:");

  // Recebe uma mensagem do cliente
  ws.on("message", (mensagem) => {
    if (!clientes.has(ws)) {
      // Se o nome de usuário ainda não foi registrado, registra agora
      clientes.set(ws, mensagem);
      enviarMensagemParaTodos(`${mensagem} entrou no chat!`);
    } else {
      // Caso o nome já tenha sido registrado, trata a mensagem como uma mensagem de chat
      enviarMensagemParaTodos(`${clientes.get(ws)}: ${mensagem}`);
    }
  });

  // Notifica quando um cliente se desconecta
  ws.on("close", () => {
    const usuario = clientes.get(ws);
    if (usuario) {
      clientes.delete(ws); // Remove o cliente do mapa
      enviarMensagemParaTodos(`${usuario} saiu do chat.`);
    }
  });
});

// Envia mensagem para todos os clientes conectados
function enviarMensagemParaTodos(mensagem) {
  clientes.forEach((_, cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensagem);
    }
  });
}
