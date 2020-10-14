import React from 'react';
import { Button,Grid, Menu,Image } from 'semantic-ui-react'
import Search from './Search';
import {Link } from 'react-router-dom';

function Navbar (props){
  return (<nav className='menu-wrapper'>
    <Grid>
      <Grid.Row>
        <Grid.Column width={3}>
            <Image id="main-logo" src='/assets/images/layout/Logo.png' as={Link} to='/'/>
        </Grid.Column>
        <Grid.Column width={6}></Grid.Column>
        <Grid.Column width={7}>
            <Search/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="menu-bar">
        <Grid.Column width={10}>
          <Button.Group>
          {/* <Button as={Link} to='/'>Home</Button>*/}
          <Button as={Link} to='/scenarios'>시나리오</Button>
          <Button as={Link} to='/replays'>리플레이</Button> 
          <Button as={Link} to='/news'>공지사항</Button>    
          <Button as={Link} to='/about'>도움말</Button>       
          </Button.Group>
        </Grid.Column>
        <Grid.Column width={6}>
          <Button.Group className="user-buttons">
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/library'>내 책장</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to={`/user/${props.currentUser!=null?props.currentUser.userName:null}`}>프로필</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/user'>내 정보</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/logout'>로그아웃</Button>:<Button as={Link} to='/login'>로그인</Button>} 
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
</nav>);
}
export default Navbar