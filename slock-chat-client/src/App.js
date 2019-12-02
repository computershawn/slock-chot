import React, { Component } from 'react';
import './App.css';
import SideBar from './components/SideBar';
import MessageArea from './components/MessageArea';
import MessageInput from './components/MessageInput';
import Comms from './utils/communication';
import io from 'socket.io-client';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySelf: {},
      messageStream: [
        {
          userName: 'rebecca',
          avi: 'avi-07',
          content: "What are you doing here?",
        },
        {
          userName: 'nichelle',
          avi: 'avi-19',
          content: "Take it easy I'm just a messenger. I brought you a drink.",
        },
        {
          userName: 'rebecca',
          avi: 'avi-07',
          content: "I don't want your drink. Why are you following me?",
        },
        // {
        //   userName: 'nichelle',
        //   avi: 'avi-19',
        //   content: "I'm not following you. I'm looking for you. Big difference.",
        // }
      ],

    };
  }

  componentDidMount() {
    Comms.initialize();
    // const socket = io('http://localhost:3000');
    const newMessage = {
      userName: 'nichelle',
      avi: 'avi-19',
      content: "I'm not following you. I'm looking for you. Big difference.",
    }
    const updatedStream = [...this.state.messageStream, newMessage];
    this.setState({
      mySelf: Comms.mySelf,
      messageStream: updatedStream,
    })
  }

  render() {
    const { mySelf, messageStream } = this.state;
    return (
      <div className="App">
        <header>
          <h3 className="app-title">slock</h3>
          <h4 id="user-name">{mySelf.firstName} {mySelf.lastName}</h4>
        </header>
        <main>
          <div className="main-content">
            <SideBar />
            <MessageArea messageStream={messageStream} />
          </div>
          <MessageInput />
        </main>
      </div>
    );
  }
}