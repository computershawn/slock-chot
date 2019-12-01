const socket = io();
let typing = 0;
const userNames = [
  'Talitha Towns', 'Kerri Kent', 'Delmy Dohrmann', 'Cory Chenoweth', 'Cindy Schmitt',
  'Rebecca Respass', 'Owen Oreilly', 'Olympia Oquendo', 'Bettina Burdo', 'Nichelle Nanez',
  'Ramon Rine', 'Lorrie Lecompte', 'Marilyn Martinelli', 'Katelynn Karls', 'Kiera Knepper',
  'Dell Dafoe', 'Josphine Joaquin', 'Jacquelyne Jamerson', 'Maisha Manke', 'Dorinda Daum',
  'Suanne Sagers', 'Domenic Decola', 'Jessica Junior', 'Noel Najarro', 'Marcelo Mcdonough',
  'Luci Levron', 'Wei Winton', 'Domitila Drummond', 'Velma Vince', 'Brian Blackford',
  'Eryn Espinosa', 'Rachele Rodden', 'Brent Borkowski', 'Idell Ishikawa', 'Ervin Ellen',
  'Han Hatten', 'Paul Perrella', 'Bob Bosarge', 'Lolita Lew', 'Stefania Shover'
];

const randomUserIndex = Math.floor(Math.random() * userNames.length)
socket.userName = userNames[randomUserIndex]
socket.on('chat message', msg => appendMessage(0, msg));
socket.on('arrived', user => appendMessage(1, `[ ${user} joined ]`));
socket.on('byebye', user => appendMessage(1, `[ ${user} left ]`));

const getAvi = (firstName) => {
  const index = userNames.findIndex(item => item.includes(firstName))
  return (index < 10) ? `avi-0${index}.png` : `avi-${index}.png`;
}

// Track and display how many users are currently typing
socket.on('typing status', usersTyping => {
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

socket.on('connect', function () {
  // Let the server know you've arrived
  socket.emit('announce', socket.userName);
});

const begin = () => {
  const form = document.querySelector('#chat-form');
  const userInput = document.querySelector('#msg');
  userInput.addEventListener('input', checkTyping);
  form.addEventListener('submit', handleSubmit);
  document.getElementById("user-name").innerHTML = socket.userName;
}

const handleSubmit = evt => {
  evt.preventDefault();
  const msg = document.querySelector('#msg').value;
  const m = msg.trim();
  if(m.length > 0) {
    socket.emit('chat message', m);
    appendMessage(0, `${socket.userName.split(' ')[0]}||||${m}`);
  }
  document.querySelector('#msg').value = '';
  echoTyping(0);
}

// Notify the server that I am typing
const echoTyping = isTyping => {
  socket.emit('user typing', isTyping === 1);
  typing = isTyping;
}

// Function checkTyping figures out whether user
// has started or stopped typing
const checkTyping = (e) => {
  const s = e.target.value;
  if(typing === 1 && s.length === 0) {
    // user finished typing
    echoTyping(0);
  }
  if(typing === 0 && s.length > 0) {
    // user started typing
    echoTyping(1);
  }
}

const appendMessage = (type, msg) => {
  const listItem = document.createElement("li");
  const cssClass = (type === 0) ? 'user-msg' : 'notification';
  listItem.classList.add(cssClass);
  listItem.innerHTML = msg;
  if(type === 0) {
    const m = msg.split('||||') // A little bit janky
    const aviFileName = getAvi(m[0]);
    let elem = "<div class='message-cont'>";
    elem += `<div class='avi-cont'><img class="avi-image" src='/assets/avis/${aviFileName}' alt="avatar image" width="24" height="24" /></div>`
    elem += `<div><p><span class="user-name">${m[0]}</span> / ${m[1]}</p></div>`;
    elem += '</div>';
    listItem.innerHTML = elem;
  }
  const messageList = document.getElementById("messages")
  messageList.appendChild(listItem);
  const lastItem = messageList.lastElementChild;
  lastItem.scrollIntoView();
}

window.addEventListener('DOMContentLoaded', (event) => {
  begin();
});