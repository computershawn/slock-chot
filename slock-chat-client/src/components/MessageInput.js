import React from 'react';
import PropTypes from 'prop-types';


function MessageInput(props) {
    const anyoneElseTyping = props.otherUsersTyping !== '…';
    return (
      <div className="footer-content">
        { anyoneElseTyping &&
          <div id="notify-typing"><p id="users-typing">{props.otherUsersTyping}<span className="blink">…</span></p></div>
        }
        <form id="chat-form" action="" onSubmit={props.handleSubmit}>
          <input id="msg" name="messageInput" autoComplete="off" onChange={props.handleChange} /><button>Send</button>
        </form>
      </div>
    );
}

MessageInput.propTypes = {
  otherUsersTyping: PropTypes.string.isRequired
}

MessageInput.defaultProps = {
  otherUsersTyping: '-',
}

export default MessageInput;