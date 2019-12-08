import React, { Component, useContext } from 'react';
import Notification from './Notification';
import Message from './Message';
import NotifyContext from '../utils/notify-context';
// import PropTypes from 'prop-types';
// import io from 'socket.io-client';
// import users from '../utils/tempData';

// export default class MessageArea extends Component {
//   // ...
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     typing: 0,
//   //   };
//   // }

//   render() {
//     const { stream, lobbyStatus } = this.props;
//     // const info = useContext(NotifyContext);
//     // console.log(info);

//     return (
//       <div className="messages-wrapper">
//         <ul className="notification-list" id="notifications">
//           {lobbyStatus.map((d, index) => <Notification key={index} data={d} />)}
//         </ul>
//         <ul className="message-list" id="messages">
//           {stream.map((d, index) => <Message key={index} data={d} />)}
//         </ul>
//       </div>
//     );
//   }
// }


// // FIX THIS...
// // MessageArea.propTypes = {
// //   user: PropTypes.shape({
// //     userName: PropTypes.string,
// //     avi: PropTypes.string,
// //   }).isRequired,
// //   content: PropTypes.string.isRequired,
// // }

//export default class MessageArea extends Component {
function MessageArea(props) {
  // ...
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     typing: 0,
  //   };
  // }

  // render() {
    const { stream, lobbyStatus } = props;
    const dismiss = useContext(NotifyContext);
    // console.log(info);

    return (
      <div className="messages-wrapper">
        <ul className="notification-list" id="notifications">
          {lobbyStatus.map((d, index) => <Notification dismiss={() => dismiss(index)} key={index} data={d} />)}
        </ul>
        <ul className="message-list" id="messages">
          {stream.map((d, index) => <Message key={index} data={d} />)}
        </ul>
      </div>
    );
//  }
}

export default MessageArea;

// FIX THIS...
// MessageArea.propTypes = {
//   user: PropTypes.shape({
//     userName: PropTypes.string,
//     avi: PropTypes.string,
//   }).isRequired,
//   content: PropTypes.string.isRequired,
// }