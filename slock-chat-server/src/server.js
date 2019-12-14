const app = require('./app')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { PORT } = require('./config')

let usersOnline = {};

const addUserToGroup = (id, user) => {
  let userIds = Object.keys(usersOnline);
  if(!userIds.includes(id)) {
    usersOnline[`${id}`] = {
      userName: user.userName,
      avi: user.avi,
      typing: false,
    }
  }
  // console.log('\n|------>')
  // console.log(usersOnline)
  // console.log('<------|\n')
}

io.on('connection', function (socket) {
  // io.emit('server-greeting', "Hello from the chat server! You are now connected.");

  socket.on('disconnect', function (e) {
    // Should make this a separate function that
    // can be called here AND in the below case
    // when server receives 'user typing' msg
    usersOnline[socket.id].typing = false;
    const usersTyping = Object.entries(usersOnline)
      .filter(item => item[1].typing)
      .map(item => {
        const id = item[0];
        const userName = usersOnline[id].userName;
        return [id, userName];
      });
    // console.log(usersTyping);
    io.emit('typing-status', usersTyping);
    // ^^^^^^^^^^^^^^^^
    // Send message to everyone except original sender
    // Notifies other users that this user left
    const userName = usersOnline[socket.id].userName;
    socket.broadcast.emit('bye-bye', userName); 
    delete usersOnline[socket.id];
  });

  socket.on('chat-message-out', (msg) => {
    // Send message to everyone except original sender
    const user = usersOnline[socket.id];
    // console.log('new message:', msg);
    socket.broadcast.emit('chat-message-in', {...user, content: msg});
  });

  socket.on('announce', (u) => {
    // Send message to everyone except original sender
    // Notifies other users that this user has arrived
    socket.broadcast.emit('arrived', u.userName);
    addUserToGroup(socket.id, u);
  });
  
  socket.on('user-typing', (typingStatus) => {
    usersOnline[socket.id].typing = typingStatus;
    const usersTyping = Object.entries(usersOnline)
      .filter(item => item[1].typing)
      .map(item => {
        const id = item[0];
        const userName = usersOnline[id].userName;
        return [id, userName];
      });
      io.emit('typing-status', usersTyping);
      // console.log('usersTyping', usersTyping);
  })
});

http.listen(PORT, function () {
  console.log(`Slock server listening on *:${PORT}`);
});