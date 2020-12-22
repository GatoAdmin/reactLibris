import React from 'react';
import { Button,Grid, Menu,Image, Icon } from 'semantic-ui-react'
import Search from './Search';
import Shortcut from './navShort';
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
      activeItem:active,
      activeSideMenu:false
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  handleSideMenuClick = () => {console.log("사이드메뉴우"); this.setState((prevState) =>({ activeSideMenu: !prevState.activeSideMenu }))}
  
  render (){
    return (
    <nav className='menu-wrapper'>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
              <Image id="main-logo" src='/assets/images/layout/Logo.png' onClick={(e)=>this.handleItemClick(e,"home")} as={Link} to='/'/>
          </Grid.Column>
          <Grid.Column width={6}></Grid.Column>
          <Grid.Column width={7}>
              <Search/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="menu-bar">
          <Grid.Column width={10}>
          <Menu secondary>
            <Menu.Item className="menu-button" name="scenarios" active={this.state.activeItem === 'scenarios'} onClick={this.handleItemClick} as={Link} to='/scenarios'>시나리오</Menu.Item>
            <Menu.Item className="menu-button" name="replays"   active={this.state.activeItem === 'replays'} onClick={this.handleItemClick} as={Link} to='/replays'>리플레이</Menu.Item> 
            <Menu.Item className="menu-button" name="about"     active={this.state.activeItem === 'about'} onClick={this.handleItemClick} as={Link} to='/about'>도움말</Menu.Item>       
            
          </Menu>
            {/* <Button.Group>
            <Button className="menu-button" as={Link} to='/scenarios'>시나리오</Button>
            <Button className="menu-button" as={Link} to='/replays'>리플레이</Button> 
            <Button className="menu-button" as={Link} to='/news'>공지사항</Button>    
            <Button className="menu-button" as={Link} to='/about'>도움말</Button>       
            </Button.Group> */}
          </Grid.Column>
          <Grid.Column width={6}>
          <Menu className="user-buttons" secondary>
            <Menu.Item className="menu-button" name="news"      active={this.state.activeItem === 'news'} onClick={this.handleItemClick} as={Link} to='/news'>새소식</Menu.Item>    
             {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="library" active={this.state.activeItem === 'library'} onClick={this.handleItemClick} as={Link} to='/library'>내 책장</Menu.Item>:null}
             {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="shortcut" onClick={this.handleSideMenuClick} as={Button}><Icon name="sidebar" fitted/></Menu.Item> :null}
             {/* {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="profile"   active={this.state.activeItem === 'profile'} onClick={this.handleItemClick} as={Link} to={`/user/${this.props.currentUser!==null?this.props.currentUser.userName:''}`}>프로필</Menu.Item> :null}
             {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?<Menu.Item className="menu-button" name="user"      active={this.state.activeItem === 'user'} onClick={this.handleItemClick} as={Link} to='/user'>내 정보</Menu.Item>    :null} */}
             {typeof(this.props.currentUser) === 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!==undefined?null:<Menu.Item className="menu-button" name="login" active={this.state.activeItem === 'login'} onClick={this.handleItemClick} as={Link} to='/login'>로그인</Menu.Item>}            
          </Menu>
            {/* <Button.Group className="user-buttons">
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)&&this.state.currentUser!=undefined?<Button className="menu-button" as={Link} to='/library'>내 책장</Button>:null}
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)&&this.state.currentUser!=undefined?<Button className="menu-button" as={Link} to={`/user/${this.state.currentUser!=null?this.state.currentUser.userName:null}`}>프로필</Button>:null}
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)&&this.state.currentUser!=undefined?<Button className="menu-button" as={Link} to='/user'>내 정보</Button>:null}
            {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)&&this.state.currentUser!=undefined?<Button className="menu-button" as={Link} to='/logout'>로그아웃</Button>:<Button as={Link} to='/login'>로그인</Button>} 
            </Button.Group> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {this.state.activeSideMenu?<Shortcut currentUser={this.props.currentUser} handleSideMenuClick={this.handleSideMenuClick}/>:null}
  </nav>);
  }
}
export default Navbar