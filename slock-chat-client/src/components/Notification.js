import React, { Component } from 'react';
// import PropTypes from 'prop-types';


export default class Notification extends Component {
  // ...
  render() {
    const { data, dismiss } = this.props;
    const person = data[0];
    const direction = (data[1] === 1) ? 'joined' : 'left';
    // const aviURL = `https://res.cloudinary.com/sjcpu4096/image/upload/${data.avi}.png`;
    return (
      <li>
        <div className="notify-cont">
          <div className="notify-text">{person} {direction}</div>
          <div onClick={dismiss} className="dismiss-notify">✕</div>
        </div>
      </li>
    );
  }
}

// Notification.propTypes = {
//   data: PropTypes.shape({
//     userName: PropTypes.string.isRequired,
//     avi: PropTypes.string.isRequired,
//     content: PropTypes.string.isRequired,
//   })
// }