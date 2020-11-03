import React from 'react';
import axios from 'axios';
import { CookiesProvider } from 'react-cookie';
import './Layout/layout.css';
import {Switch, Route, Link,useHistory, Redirect } from 'react-router-dom';
import AuthRoute from './Layout/AuthRoute';
import Main from './Main';
import About from './About';
import NotFound from './NotFound';
import Replay from './Replay';
import Scenario from './Scenario';
import News from './News';
import User from './User';
import Library from './Library';
import Comment from './Comment';
import Chronicle from './Chronicle';
import Login from './Main/loginPage'
import Logout from './Main/logoutPage';
import Signup from './Main/signup';
import SearchResult from './Main/searchResult';
import Footer from './Layout/footer';
import Navbar from './Layout/pageNav';
import Landing from './Main/landing';
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

  responseFailureGoogle = (response) => {
    console.log(response);
  }
  
  responseSuccessGoogle = (response) => {
    console.log(response);
    axios.post('/login/google',{tokenId:response.tokenId, userEmail:response.profileObj.email})
    .then((res)=>{
      console.log("성공");
      console.log(res);
      this.setState({ currentUser : res.data.currentUser });
      window.location.href = res.data.redirect;
    }).catch((err)=>{
      console.log("실패");
      console.log(err);
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
      <CookiesProvider>

      <header>
        <Navbar currentUser={this.state.currentUser}/>
      </header>
      <div className='contents-wrapper'>
        <Switch>
              <Route exact path="/" component={(props)=><Main currentUser={this.state.currentUser}{...props}/>} />
              <Route path="/about" component={About} />
              <Route path="/news" component={(props)=><News currentUser={this.state.currentUser}{...props}/>} />
              <Route path="/replays" component={(props)=><Replay currentUser={this.state.currentUser}{...props}/>} />
              <Route path="/scenarios" component={(props)=><Scenario  currentUser={this.state.currentUser}{...props}/>} /> 
              <Route path="/user" component={(props)=><User currentUser={this.state.currentUser}{...props}/>} />
              <AuthRoute
                currentUser={this.state.currentUser}
                path="/library"
                render={(props)=><Library currentUser={this.state.currentUser}{...props}/>}
              />
              <Route path="/search" component={(props)=><SearchResult currentUser={this.state.currentUser}{...props}/>} /> 
            
             <Route path="/comments" component={(props)=><Comment currentUser={this.state.currentUser}{...props}/>} />
             <Route path="/chronicles" component={(props)=><Chronicle currentUser={this.state.currentUser}{...props}/>} />
             <Route exact path={`/landing`} component={Landing} />
             <Route path='/login' component={(props)=><Login responseSuccessGoogle={this.responseSuccessGoogle} responseFailureGoogle={this.responseFailureGoogle} login_process={this.login}/>} />
             <AuthRoute path='/logout' currentUser={this.state.currentUser} render={(props)=><Logout currentUser={this.state.currentUser}{...props}/>} />
             <Route path='/signup' component={Signup } />
            <Route component={NotFound} />
             <Redirect path="/undefined" to="/" />

        </Switch>
        </div>
    <Footer/>
      </CookiesProvider>
  </div>
  );}
}
export default BaseLayout;
