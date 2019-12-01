import React, { Component } from 'react';
import './App.css';
import Comms from './utils/communication';


export default class App extends Component {
  componentDidMount() {
    // socket.on('connect', () => {
    //   // Let the server know you've arrived
    //   socket.emit('announce', socket.userName);
    // });
    // socket.on("server-greeting", data => {
    //   console.log(data);
    // });
    Comms.initialize();
    Comms.randomUser();
    // console.log(comms.hello);
    // console.log(Comms.);
  }

  render() {
    return (
      <div className="App">
        <header>
          <h3 className="app-title">slock</h3>
          <h4 id="user-name">…</h4>
        </header>
        <main>
          <div className="main-content">
            <div className="sidebar-wrapper">
              <p>list of users online...</p>
            </div>
            <div className="messages-wrapper">
              <ul className="message-list" id="messages"></ul>
            </div>
          </div>
          <div className="footer-content">
            <div id="notify-typing" className="hidden"><p id="users-typing">...</p></div>
            <form id="chat-form" action="">
              <input id="msg" autoComplete="off" /><button>Send</button>
            </form>
          </div>
        </main>
      </div>
    );
  }
}