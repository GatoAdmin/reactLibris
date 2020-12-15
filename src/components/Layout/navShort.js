import React from 'react';
import { Button,Grid, Menu,Image, Icon } from 'semantic-ui-react'
import Moment from 'react-moment';
import axios from 'axios';
import Search from './Search';
import {Link } from 'react-router-dom';

class Navbar extends React.Component{
  constructor(props){
    super();
    var url = window.location.href.split('/');
    var active = url[3];
    if(active === "user"){
      
    }
    this.state={
      currentUser:props.currentUser,
      activeItem:active
    }
  }
  
  makeArticle =() =>{
    axios.post('/scenarios/make')
        .then(res => {
            window.location.href = `/scenarios/edit/${res.data.id}`;
        })
        .catch(function (err) {
            console.log(err);
        })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  render (){
    console.log(this.props.currentUser);
    return (
    <nav className='menu-wrapper shortcut-menu'>
      {this.state.activeItem === 'articles'?
      <Menu className="user-buttons" vertical>
        <Menu.Item>
          <h3>임시 저장글</h3> <Button onClick={()=>this.makeArticle()}>새로 만들기</Button>
        </Menu.Item>
        {this.props.currentUser.saveScenarios.map((scenario,index)=>{
          return (
          <Menu.Item key={index} as={Link} to={`/scenarios/edit/${scenario._id}`}>
            <Menu.Header>{scenario.title}</Menu.Header>
            <Moment format="YY-MM-DD">{scenario.created}</Moment>
          </Menu.Item>
          );
        })}
      </Menu>:
      <Menu className="user-buttons" vertical> 
          {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="articles"  active={this.state.activeItem === 'articles'} onClick={this.handleItemClick} as={Button}><Icon name="plus"/></Menu.Item> :null}
          {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="profile" onClick={this.handleItemClick} as={Link} to={`/user/${this.props.currentUser!==null?this.props.currentUser.userName:''}`}>프로필</Menu.Item> :null}
          {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="user"    onClick={this.handleItemClick} as={Link} to='/user'>내 정보</Menu.Item>    :null}
          {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" as={Link} to='/logout'>로그아웃</Menu.Item>:null}
      </Menu>
      }
  </nav>);
  }
}
export default Navbar