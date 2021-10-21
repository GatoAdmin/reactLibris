import React,{Component} from 'react';
import axios from 'axios';
import './style.css';
import BaseSocket from '../../utils/chat_base';

class ChatWindow extends Component {  
  constructor(props) {
    super(props);
    this.state = {
        username:null
    };
}
  componentDidMount() {      
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
        <BaseSocket>
        </BaseSocket>
    );

  }
}

export default ChatWindow;

