import React,{Component} from 'react';
import axios from 'axios';
import './style.css';
import socketio from 'socket.io-client';

const socket = socketio.connect('http://localhost:3000');

class ChatWindow extends Component {  
  constructor(props) {
    super(props);
    this.state = {
        username:null
    };
}
  componentDidMount() {      
    socket.on('connect', function(){ 
        console.log('connect'); 
        var name = prompt('대화명을 입력해주세요.', ''); 
        socket.emit('newUserConnect', name);
    });
    // axios.post(window.location.href)
        // .then(res=>this.setState({username:res.data.username}))
        // .catch(function (error) {
        //     console.log(error);
        // });
        
        // this.forceUpdate();
}

  render() {
    // const {username} = this.state;

    return (
        <div class="app__wrap"> 
            <div id="info" class="app__info"></div> 
            <div id="chatWindow" class="app__window"></div>
            <div class="app__input__wrap"> 
                <input id="chatInput" type="text" class="app__input" autofocus placeholder="대화를 입력해주세요."/>
                    <button id="chatMessageSendBtn" class="app__button">전송</button>
            </div>
    
        </div> 
    );

  }
}

export default ChatWindow;

