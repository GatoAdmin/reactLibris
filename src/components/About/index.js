import React,{Component} from 'react';
import axios from 'axios';
import './style.css';

class About extends Component {  
  constructor(props) {
    super(props);
    this.state = {
        username:null
    };
}
  componentDidMount() {      
  axios.post(window.location.href)
       .then(res=>this.setState({username:res.data.username}))
       .catch(function (error) {
         console.log(error);
       });
       
       this.forceUpdate();
}
  render() {
    const {username} = this.state;

    return (
      <div >
        <h1>
          About
      </h1>
      <span>          {username ? `Hello ${username}` : 'Hello World'}</span>
      </div>
    );

  }
}

export default About;

