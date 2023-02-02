const roomName = JSON.parse(document.getElementById("room-name").textContent);
const username = JSON.parse(document.getElementById("username").textContent);
const messageInput = document.getElementById("chat-message-input");
const messageSubmit = document.getElementById("chat-message-submit");
const chatForm = document.getElementById("chat-form");

let messages = [];

const chatSocket = new WebSocket(
  "ws://" + window.location.host + "/ws/chat/" + roomName + "/"
);

chatSocket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  messages.push(data);
  chatLog = document.getElementById("chat-log");
  let str = `<ul>`;
  messages.forEach((message) => {
    str += `
            <li 
                class="messages"
            >
                <span class="d-flex ${
                  message.username === username ? "bg-success" : "bg-secondary"
                } rounded my-2 me-2 p-2">
                    ${message.message}
                </span>
            </li>
            `;
  });
  str += `</ul>`;
  chatLog.innerHTML = str;
};

chatSocket.onclose = (e) => {
  console.error("Chat socket closed unexpectedly");
};
chatForm.onsubmit = (e) => {
  e.preventDefault();
  console.log("form submitted");
};
messageInput.focus();
messageSubmit.onclick = (e) => {
  const message = messageInput.value;
  chatSocket.send(JSON.stringify({ message: message, username: username }));
  messageInput.value = "";
};
