import React, { Component } from 'react';
import Message from './Message';
import PropTypes from 'prop-types';

export default class MessageArea extends Component {
  // ...
  render() {
    const { messageStream } = this.props;
    return (
      <div className="messages-wrapper">
        <ul className="message-list" id="messages">
          {messageStream.map((d, index) => <Message key={index} data={d} />)}
        </ul>
      </div>
    );
  }
}

MessageArea.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string,
    avi: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
}