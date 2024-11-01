const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  const nomeUsuario = prompt("Digite seu nome de usuário:");
  socket.send(nomeUsuario);
};

socket.onmessage = (event) => {
  console.log("Mensagem do servidor:", event.data);
};
