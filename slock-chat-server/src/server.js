const app = require('./app')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const { PORT } = require('./config')

let usersOnline = {};

const addToGroup = (id, userName) => {
  let userIds = Object.keys(usersOnline);
  if(!userIds.includes(id)) {
    usersOnline[`${id}`] = {
      name: userName,
      avi: 'http://example.com/avi.png',
      typing: false,
    }
  }
  // console.log('\n|------>')
  // console.log(usersOnline)
  // console.log('<------|\n')
}

const getShortName = (id) => {
  return usersOnline[id].name.split(' ')[0]
}

io.on('connection', function (socket) {
  io.emit('server-greeting', "Hello from the chat server! You are now connected.");
  socket.on('disconnect', function (e) {

    // Should make this a separate function that
    // can be called here AND in the below case
    // when server receives 'user typing' msg
    usersOnline[socket.id].typing = false;
    const usersTyping = Object.entries(usersOnline)
      .filter(item => item[1].typing)
      .map(item => [item[0], getShortName(item[0])]);
    io.emit('typing status', usersTyping);
    // ^^^^^^^^^^^^^^^^


    // Send message to everyone except original sender
    // Notifies other users that this user left
    const name = usersOnline[socket.id].name;
    socket.broadcast.emit('byebye', name); 
    delete usersOnline[socket.id];
  });
  socket.on('chat message', (msg) => {
    // Send message to everyone except original sender
    const shortName = getShortName(socket.id);
    socket.broadcast.emit('chat message', `${shortName}||||${msg}`);
    // socket.broadcast.emit('chat message', [shortName, msg]);
  });
  socket.on('announce', (userName) => {
    // Send message to everyone except original sender
    // Notifies other users that this user has arrived
    socket.broadcast.emit('arrived', userName);
    addToGroup(socket.id, userName);
  });
  socket.on('user typing', (typingStatus) => {
    usersOnline[socket.id].typing = typingStatus;
    const usersTyping = Object.entries(usersOnline)
      .filter(item => item[1].typing)
      .map(item => [item[0], getShortName(item[0])]);
    io.emit('typing status', usersTyping);
  })
});

http.listen(PORT, function () {
  console.log(`Slock server listening on *:${PORT}`);
});