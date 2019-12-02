import React, { Component } from 'react';

export default class MessageInput extends Component {
  // ...

  render() {
    return (
      <div className="footer-content">
        <div id="notify-typing" className="hidden"><p id="users-typing">...</p></div>
        <form id="chat-form" action="">
          <input id="msg" autoComplete="off" /><button>Send</button>
        </form>
      </div>
    );
  }
}