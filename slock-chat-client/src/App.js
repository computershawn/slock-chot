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
      mySelf: { firstName: '…', lastName: '…', userName: '', avi: 'avi-20' },
      stream: [],
      usersPresent: [],
      otherUsersTyping: '…',
      typing: 0,
    };
    this.checkTyping = this.checkTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.updateMessageList = this.updateMessageList.bind(this);
    this.notifyTypingStatus = this.notifyTypingStatus.bind(this);
  }

  updateMessageList(msg) {
    let content = '';
    if (msg.messageType === 'user-message') {
      content = msg.content;
    }
    let updatedUsersPresent = this.state.usersPresent;
    if (msg.messageType === 'system-message') {
      const person = msg.content[0];
      const arriving = msg.content[1] === 1;
      const direction = arriving ? 'joined' : 'left';
      content = `${person} ${direction}`
      if(arriving) {
        // console.log('usersPresent', usersPresent);
        updatedUsersPresent.push(person);
        // console.log('roooom', usersPresent);
      } else {
        updatedUsersPresent = updatedUsersPresent.filter(name => name !== person)
      }
    }
    const updatedStream = [
      ...this.state.stream,
      {
        messageType: msg.messageType,
        userName: msg.userName || '',
        avi: msg.avi || '',
        content: content,
      }
    ];
    this.setState({
      stream: updatedStream,
      usersPresent: updatedUsersPresent,
    }, () => {
      if(this.state.stream.length > 0) {
        document.querySelector(".message-list").lastElementChild.scrollIntoView()
      }
    })
  }

  notifyTypingStatus(status) {
    this.setState({
      otherUsersTyping: status,
    })
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
    if (msg.length > 0) {
      this.messageManager.forwardMessage(msg);
      const addThisMsgToLocalState = {
        messageType: 'user-message',
        userName: this.state.mySelf.userName,
        avi: this.state.mySelf.avi,
        content: msg,
      }
      this.updateMessageList(addThisMsgToLocalState);
    }
    this.echoTyping(0);
    evt.target.reset();
  }

  render() {
    const { mySelf, stream, usersPresent, otherUsersTyping, lobbyStatus } = this.state;
    return (
      <div className="App">
        <header className="header-content">
          <h3 className="app-title">slock</h3>
        </header>
        <div className="container">
          <div className="main-content">
            <SideBar usersPresent={usersPresent} mySelf={mySelf} />
            <NotifyContext.Provider value={noti => this.dismissLobbyStatus(noti)}>
              <MessageArea stream={stream} lobbyStatus={lobbyStatus} />
            </NotifyContext.Provider>
          </div>
        </div>
        <MessageInput otherUsersTyping={otherUsersTyping} handleChange={this.checkTyping} handleSubmit={this.handleSendMessage} />
      </div>
    );
  }
}