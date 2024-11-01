const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
const clientes = new Map();

server.on("connection", (ws) => {
  ws.send("Bem-Vindo ao chat!");


  ws.on("message", (mensagem) => {
    if (!clientes.has(ws)) {
      
      clientes.set(ws, mensagem);
      enviarMensagemParaTodos(`${mensagem} entrou no chat!`);
    } else {
      
      enviarMensagemParaTodos(`${clientes.get(ws)}: ${mensagem}`);
    }
  });

  ws.on("close", () => {
    const usuario = clientes.get(ws);
    if (usuario) {
      clientes.delete(ws); 
      enviarMensagemParaTodos(`${usuario} saiu do chat.`);
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
