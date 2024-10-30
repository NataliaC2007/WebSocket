// main.js
const socket = new WebSocket("ws://localhost:8080");

// Quando a conexão é estabelecida, solicita o nome de usuário
socket.onopen = () => {
  const nomeUsuario = prompt("Digite seu nome de usuário:");
  socket.send(nomeUsuario);
};

// Exibe no console as mensagens recebidas do servidor
socket.onmessage = (event) => {
  console.log("Mensagem do servidor:", event.data);
};
