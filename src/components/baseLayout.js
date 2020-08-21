import React from 'react';
import axios from 'axios';
import './Main/style.css';
import {Switch, Route, Link,useHistory, Redirect } from 'react-router-dom';
import { Button,Input, Menu } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';
import AuthRoute from './AuthRoute';
import Main from './Main';
import About from './About';
import NotFound from './NotFound';
import Replay from './Replay';
import Scenario from './Scenario';
import User from './User';
import Library from './Library';
import Comment from './Comment';
import Chronicle from './Chronicle';
import Login from './Main/loginPage'
import Logout from './Main/logoutPage';

class BaseLayout extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          currentUser: null
      };
  }
  login = (login_info) => {
    axios.post('/login', login_info)
    .then(res => {
      console.log("App.js login .then " , res.data);
      if(res.data.currentUser === undefined){	// 로그인 실패 빈 json형식이 넘어온 경우
        alert('login fail!');
      }
        this.setState({ currentUser : res.data.currentUser });
        window.location.href = res.data.redirect;
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
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)?<Button as={Link} to='/library'>Library</Button>:null}
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)?<Button as={Link} to='/logout'>Logout</Button>:<Button as={Link} to='/login'>Login</Button>}
            </Button.Group>
          </ul>
        </nav>
    </header>
        <div className='Contents-wrapper'>
        <Switch>
              <Route exact path="/" component={(props)=><Main currentUser={this.state.currentUser}{...props}/>} />
              <Route path="/about" component={About} />
              <Route path="/replays" component={(props)=><Replay currentUser={this.state.currentUser}{...props}/>} />
              <Route path="/scenarios" component={(props)=><Scenario  currentUser={this.state.currentUser}{...props}/>} /> 
              <Route path="/user" component={(props)=><User currentUser={this.state.currentUser}{...props}/>} />
              <AuthRoute
                currentUser={this.state.currentUser}
                path="/library"
                render={(props)=><Library currentUser={this.state.currentUser}{...props}/>}
              />
             <Route path="/comments" component={(props)=><Comment currentUser={this.state.currentUser}{...props}/>} />
             <Route path="/chronicles" component={(props)=><Chronicle currentUser={this.state.currentUser}{...props}/>} />
             <Route path={'/login'} component={(props)=><Login login_process={this.login}/>} />
             <Route path={'/logout'} component={(props)=><Logout currentUser={this.state.currentUser}{...props}/>} />
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
