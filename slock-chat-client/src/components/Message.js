import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Message extends Component {
  // ...
  render() {
    const { data } = this.props;
    const aviURL = `https://res.cloudinary.com/sjcpu4096/image/upload/${data.avi}.png`;
    return (
      <li>
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
  }
}

Message.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string,
    avi: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
}