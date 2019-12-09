import io from 'socket.io-client';
import users from './tempData';

export default class MessageStream {
  constructor() {
    this.maxTyping = 4;
    const socket = io('http://localhost:3008'); 
    const randomUserIndex = Math.floor(Math.random() * users.length)
    socket.mySelf = users[randomUserIndex];
    socket.on('connect', () => {
      // Let the server know you've arrived
      socket.emit('announce', socket.mySelf);
    });
    // socket.on('server-greeting', greeting => console.log(greeting));
    socket.on('chat-message-in', message => this.onMessageIn({...message, messageType: 'user-message'}));
    socket.on('arrived', userName => this.onMessageIn({messageType: 'system-message', content: [userName, 1]}));
    socket.on('bye-bye', userName => this.onMessageIn({messageType: 'system-message', content: [userName, 0]}));
    socket.on('typing-status', usersTyping => {
      const otherUsers = usersTyping.filter(item => item[0] !== socket.id)
      let phrase = '…';
      if (otherUsers.length > 0) {
        if (otherUsers.length === 1) {
          phrase = `${otherUsers[0][1]} is typing`
        }
        if (otherUsers.length > 1 && otherUsers.length <= this.maxTyping) {
          let s = otherUsers[0][1];
          for (let i = 1; i < otherUsers.length - 1; i++) {
            s += `, ${otherUsers[i][1]}`
          }
          s += ` and ${otherUsers[otherUsers.length - 1][1]}`;
          phrase = `${s} are typing`;
        }
        if (otherUsers.length > this.maxTyping) {
          phrase = `Several users are typing`
        }
      }
      this.onTypingStatus(phrase);
    });

    // Make the socket a property of MessageStream class instance
    this.socket = socket;
  }

  onMessageIn(msg) {
    return msg;
  }

  onTypingStatus(typingStatus) {
    return typingStatus;
  }
  
  echo(key, val) {
    this.socket.emit(key, val);
  }

  forwardMessage(msg) {
    // console.log('Server received a message', msg)
    this.socket.emit('chat-message-out', msg);
  }

  sayTypingStatus(status) {
    this.socket.emit('user-typing', status);
  }
}