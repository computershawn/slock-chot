import React from 'react';
import Message from './Message';


function MessageArea(props) {
  const { stream } = props;

  return (
    <div className="messages-wrapper">
      <ul className="message-list">
        {stream.map((d, index) => <Message key={index} data={d} />)}
      </ul>
    </div>
  );
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