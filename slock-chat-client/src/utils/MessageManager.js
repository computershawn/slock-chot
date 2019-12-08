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
    socket.on('chat-message-in', message => this.onMessageIn(message));
    socket.on('arrived', userName => this.onLobbyUpdate([userName, 1]));
    socket.on('bye-bye', userName => this.onLobbyUpdate([userName, 0]));
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

  onLobbyUpdate(lobbyStatus) {
    return lobbyStatus;
  }
  
  echo(key, val) {
    this.socket.emit(key, val);
  }

  forwardMessage(msg) {
    // console.log('Server received a message', msg)
    this.socket.emit('chat-message-out', msg);
  }

  sayTypingStatus(status) {
    // console.log(status ? 'started typing' : 'stopped typing');
    this.socket.emit('user-typing', status);
  }
}


// export default class MessageStream extends Component {
//   constructor(props) {


//     socket.on('connect', function () {
//       // Let the server know you've arrived
//       socket.emit('announce', socket.mySelf);
//     });
//     socket.on('chat-message-in', message => appendMessage(0, message));
//     socket.on('arrived', userName => appendMessage(1, `[ ${userName} joined ]`));
//     socket.on('bye-bye', userName => appendMessage(1, `[ ${userName} left ]`));

//     // // Track and display how many users are currently typing
//     // socket.on('typing-status', usersTyping => {
//     //   const maxTyping = 4;
//     //   const otherUsers = usersTyping.filter(item => item[0] !== socket.id)
//     //   const typingBar = document.getElementById('notify-typing');
//     //   if (otherUsers.length > 0) {
//     //     typingBar.classList.remove('hidden')
//     //     let typingText = document.getElementById('users-typing');
//     //     if (otherUsers.length === 1) {
//     //       typingText.innerHTML = `${otherUsers[0][1]} is typing <span class="blink">…</span>`;
//     //     }
//     //     if (otherUsers.length > 1 && otherUsers.length <= maxTyping) {
//     //       let s = otherUsers[0][1];
//     //       for (let i = 1; i < otherUsers.length - 1; i++) {
//     //         s += `, ${otherUsers[i][1]}`
//     //       }
//     //       s += ` and ${otherUsers[otherUsers.length - 1][1]}`;
//     //       typingText.innerHTML = `${s} are typing...`;
//     //     }
//     //     if (otherUsers.length > maxTyping) {
//     //       typingText.innerHTML = 'Several users are typing <span class="blink">…</span>';
//     //     }
//     //   } else {
//     //     typingBar.classList.add('hidden')
//     //   }
//     // });

//     const appendMessage = (type, msg) => {
//       if (type === 0) {
//         const updatedStream = [
//           ...this.state.stream,
//           {
//             userName: msg.userName, 
//             avi: msg.avi,
//             content: msg.text,
//           }
//         ];
//         this.setState({
//           stream: updatedStream,
//         })
//       } else {
//         // TODO: Add 'joined' or 'left' notification to DOM but not to the 'stream' array
//         console.log(msg);
//       }
//       // const listItem = document.createElement("li");
//       // const cssClass = (type === 0) ? 'user-msg' : 'notification';
//       // listItem.classList.add(cssClass);
//       // listItem.innerHTML = msg;
//       // if (type === 0) {
//       //   let elem = "<div class='message-cont'>";
//       //   elem += `<div class='avi-cont'><img class="avi-image" src='https://res.cloudinary.com/sjcpu4096/image/upload/${msg.avi}.png' alt="avatar" width="24" height="24" /></div>`
//       //   elem += `<div><p><span class="user-name">${msg.userName}</span> / ${msg.text}</p></div>`;
//       //   elem += '</div>';
//       //   listItem.innerHTML = elem;
//       // }
//       // const messageList = document.getElementById("messages")
//       // messageList.appendChild(listItem);
//       // const lastItem = messageList.lastElementChild;
//       // lastItem.scrollIntoView();
//     }    
//   }


//   render() {
//     const { stream } = this.state;
//     return (
//       <MessageArea stream={stream} />
//     );
//   }
// }