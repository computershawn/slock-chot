import io from 'socket.io-client';
import users from './tempData'

const socket = io('http://localhost:3000');

const getUser = () => {
  const randomUserIndex = Math.floor(Math.random() * users.length)
  return(users[randomUserIndex]);
}

const mySelf = getUser();

socket.mySelf = mySelf;
socket.on('connect', function () {
  // Let the server know you've arrived
  socket.emit('announce', socket.mySelf);
});
socket.on('chat-message-in', message => appendMessage(0, message));
socket.on('arrived', userName => appendMessage(1, `[ ${userName} joined ]`));
socket.on('bye-bye', userName => appendMessage(1, `[ ${userName} left ]`));


// Track and display how many users are currently typing
socket.on('typing-status', usersTyping => {
  const maxTyping = 4;
  const otherUsers = usersTyping.filter(item => item[0] !== socket.id )
  const typingBar = document.getElementById('notify-typing');
  if(otherUsers.length > 0) {
    typingBar.classList.remove('hidden')
    let typingText = document.getElementById('users-typing');
    if(otherUsers.length === 1) {
      typingText.innerHTML = `${otherUsers[0][1]} is typing <span class="blink">…</span>`;
    }
    if(otherUsers.length > 1 && otherUsers.length <= maxTyping) {
      let s = otherUsers[0][1];
      for(let i = 1; i < otherUsers.length - 1; i++) {
        s += `, ${otherUsers[i][1]}`
      }
      s += ` and ${otherUsers[otherUsers.length - 1][1]}`;
      typingText.innerHTML = `${s} are typing...`;
    }
    if(otherUsers.length > maxTyping) {
      typingText.innerHTML = 'Several users are typing <span class="blink">…</span>';
    }
  } else {
    typingBar.classList.add('hidden')    
  }
});

const initializeChat = () => {
  // const form = document.querySelector('#chat-form');
  // const userInput = document.querySelector('#msg');
  // userInput.addEventListener('input', checkTyping);
  // form.addEventListener('submit', handleSubmit);
  // document.getElementById("user-name").innerHTML = socket.mySelf;
}

// const handleSubmit = evt => {
//   evt.preventDefault();
//   const inputText = document.querySelector('#msg').value;
//   const msg = inputText.trim();
//   if(msg.length > 0) {
//     socket.emit('chat-message-out', msg);
//     appendMessage(0, {...socket.mySelf, text: msg});
//   }
//   document.querySelector('#msg').value = '';
//   echoTyping(0);
// }

// Notify the server that I am typing
// const echoTyping = isTyping => {
//   socket.emit('user-typing', isTyping === 1);
//   typing = isTyping;
// }

// Function checkTyping figures out whether user
// has started or stopped typing
// const checkTyping = (e) => {
//   const s = e.target.value;
//   if(typing === 1 && s.length === 0) {
//     // user finished typing
//     echoTyping(0);
//   }
//   if(typing === 0 && s.length > 0) {
//     // user started typing
//     echoTyping(1);
//   }
// }

const appendMessage = (type, msg) => {
  const listItem = document.createElement("li");
  const cssClass = (type === 0) ? 'user-msg' : 'notification';
  listItem.classList.add(cssClass);
  listItem.innerHTML = msg;
  if(type === 0) {
    let elem = "<div class='message-cont'>";
    elem += `<div class='avi-cont'><img class="avi-image" src='https://res.cloudinary.com/sjcpu4096/image/upload/${msg.avi}.png' alt="avatar" width="24" height="24" /></div>`
    elem += `<div><p><span class="user-name">${msg.userName}</span> / ${msg.text}</p></div>`;
    elem += '</div>';
    listItem.innerHTML = elem;
  }
  const messageList = document.getElementById("messages")
  messageList.appendChild(listItem);
  const lastItem = messageList.lastElementChild;
  lastItem.scrollIntoView();
}

const Comms = {
  initialize: initializeChat,
  mySelf: mySelf,
}


export default Comms