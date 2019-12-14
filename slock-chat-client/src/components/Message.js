import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Message extends Component {
  // ...
  showUserMsg(data) {
    const aviURL = `https://res.cloudinary.com/sjcpu4096/image/upload/${data.avi}.png`;
    return (
      <li className="user-msg">
        <div className='message-cont'>
          <div className='avi-cont'>
            <img className="avi-image" src={aviURL} alt="user avatar" width="24" height="24" />
          </div>
          <div>
            <p>
              <span className="user-name">{data.userName}</span> / {data.content}
            </p>
          </div>
        </div>
      </li>
    );
  };

  showSysMsg(data) {
    return (
      <li className="sys-msg">
        <div className='message-cont'>
          <div>
            <p>
              <em>{data.content}</em>
            </p>
          </div>
        </div>
      </li>
    );
  };

  render() {
    const { data } = this.props;
    if(data.messageType === 'user-message') {
      return this.showUserMsg(data);
    }
    if(data.messageType === 'system-message') {
      return this.showSysMsg(data);
    }
    return (
      <li>
        <div>
          <p>
            NO DATA
          </p>
        </div>
      </li>
    );
  }
}

Message.propTypes = {
  data: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    avi: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })
}