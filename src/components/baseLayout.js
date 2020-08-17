import React from 'react';
import axios from 'axios';
import './Main/style.css';
import {Switch, Route, Link} from 'react-router-dom';
import { Button,Input, Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';
import Main from './Main';
import About from './About';
import NotFound from './NotFound';
import Replay from './Replay';
// import ReplayMake from './Replay/Make'
// import ReplayViewer from './Replay/View';
import Scenario from './Scenario';
import User from './User';
import Login from './Main/loginPage'

class BaseLayout extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          currentUser: null
      };
  }
  login = (login_info) => {
    axios.post('/login', JSON.stringify(login_info))
    .then(data => {
      console.log("App.js login .then " , data);
      if(data.currentUser === undefined){	// 로그인 실패 빈 json형식이 넘어온 경우
        alert('login fail!');
      }
        this.setState({ currentUser : data })
        console.log(this.state.currentUser)
    })
  }

  componentDidMount() {
    axios.post('/user')
    .then(res => this.setState({currentUser: res.data.currentUser }))
    .catch(function (err) {
        console.log(err);
    });
  }
  render() {
    console.log(this.state.currentUser)
  return (
    <div className="base">
    <header>
        <nav className='Menu-wrapper'>
          <ul>
            <Button.Group>
            <Button as={Link} to='/'>Home</Button>{/* <Link to='/'><li>Home</li></Link> */}
            <Button as={Link} to='/about'>about</Button>
            <Button as={Link} to='/replays'>Replay</Button>
            <Button as={Link} to='/scenarios'>Scenario</Button>
            <Button as={Link} to='/login'>Login</Button>
            </Button.Group>
          </ul>
        </nav>
    </header>
        <div className='Contents-wrapper'>
        <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/about" component={About} />
              <Route path="/replays" component={Replay} />
              <Route path="/scenarios" component={Scenario} /> 
              <Route path="/user" component={User} />
              <Route path={'/login'} component={()=><Login login={this.login}/>} />
              <Route component={NotFound} />

        </Switch>
        </div>
    <footer>
        React Router v5 Browser Example (c) 2017
    </footer>
  </div>
  );}
}
export default BaseLayout;
