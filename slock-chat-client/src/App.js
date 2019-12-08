import React, { Component } from 'react';
import './App.css';
import SideBar from './components/SideBar';
import MessageArea from './components/MessageArea';
import MessageInput from './components/MessageInput';
import MessageManager from './utils/MessageManager';
import NotifyContext from './utils/notify-context';


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      mySelf: { firstName: '…', lastName: '…', userName: '', avi: 'avi-20'},
      stream: [],
      lobbyStatus: [],
      otherUsersTyping: '…',
      // stream: [
      //   {
      //     userName: 'rebecca',
      //     avi: 'avi-07',
      //     content: "What are you doing here?",
      //   },
      //   {
      //     userName: 'nichelle',
      //     avi: 'avi-19',
      //     content: "Take it easy I'm just a messenger. I brought you a drink.",
      //   },
      //   {
      //     userName: 'rebecca',
      //     avi: 'avi-07',
      //     content: "I don't want your drink. Why are you following me?",
      //   },
      //   {
      //     userName: 'nichelle',
      //     avi: 'avi-19',
      //     content: "I'm not following you. I'm looking for you. Big difference.",
      //   },
      // ],
      typing: 0,
    };
    this.checkTyping = this.checkTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.updateMessageList = this.updateMessageList.bind(this);
    this.notifyTypingStatus = this.notifyTypingStatus.bind(this);
    this.notifyLobbyStatus = this.notifyLobbyStatus.bind(this);
  }

  updateMessageList(msg) {
    // console.log('just received this message:', msg);
    const updatedStream = [
      ...this.state.stream,
      {
        userName: msg.userName, 
        avi: msg.avi,
        content: msg.content,
      }
    ];
    this.setState({
      stream: updatedStream,
    })
  }

  notifyTypingStatus(status) {
    this.setState({
      otherUsersTyping: status,
    })
  }

  notifyLobbyStatus(entryOrExit) {
    let newLobbyStatus = this.state.lobbyStatus;
    newLobbyStatus.unshift(entryOrExit);
    this.setState({
      lobbyStatus: newLobbyStatus,
    });
  }

  componentDidMount() {
    const m = new MessageManager();
    m.onMessageIn = this.updateMessageList;
    m.onTypingStatus = this.notifyTypingStatus;
    m.onLobbyUpdate = this.notifyLobbyStatus;
    this.messageManager = m
    this.setState({
      mySelf: m.socket.mySelf,
    })
  }

  // Notify the server that I am typing
  echoTyping = isTyping => {
    this.setState({
      typing: isTyping,
    });
    this.messageManager.sayTypingStatus(isTyping === 1);
  }

  // Dismiss notification
  dismissLobbyStatus = n => {
    const newLobbyStatus = this.state.lobbyStatus.filter((_, index) => index !== n);
    this.setState({
      lobbyStatus: newLobbyStatus,
    });
  }

  // // Function checkTyping figures out whether user
  // // has started or stopped typing
  checkTyping(e) {
    const text = e.target.value;
    const typing = this.state.typing;
    if (typing === 1 && text.length === 0) {
      // user finished typing
      this.echoTyping(0);
    }
    if (typing === 0 && text.length > 0) {
      // user started typing
      this.echoTyping(1);
    }
    this.setState({
      msgText: text,
    });

  }

  handleSendMessage(evt) {
    evt.preventDefault();
    const msg = this.state.msgText.trim();
    if(msg.length > 0) {
      this.messageManager.forwardMessage(msg);
      const addThisMsgToLocalState = {
        userName: this.state.mySelf.userName,
        avi: this.state.mySelf.avi,
        content: msg,
      }
      this.updateMessageList(addThisMsgToLocalState);
      // console.log('about to send this message:', addThisMsgToLocalState);
    }
    this.echoTyping(0);
    evt.target.reset();
  }

  render() {
    const { mySelf, stream, otherUsersTyping, lobbyStatus} = this.state;
    return (
      <div className="App">
        <header>
          <h3 className="app-title">slock</h3>
          <h4 id="user-name">{mySelf.firstName} {mySelf.lastName}</h4>
        </header>        
        <main>
          <div className="main-content">
            <SideBar />
            <NotifyContext.Provider value={noti => this.dismissLobbyStatus(noti)}>
              <MessageArea stream={stream} lobbyStatus={lobbyStatus} />
            </NotifyContext.Provider>
          </div>
          <MessageInput otherUsersTyping={otherUsersTyping} handleChange={this.checkTyping} handleSubmit={this.handleSendMessage} />
        </main>
      </div>
    );
  }
}