import React from 'react';
import { Button,Grid, Menu,Image } from 'semantic-ui-react'
import Search from './Search';
import {Link } from 'react-router-dom';

function Navbar (props){
  return (<nav className='menu-wrapper'>
  <ul>
    <Grid>
      <Grid.Row>
        <Grid.Column width={3}>
            <Image id="main-logo" src='/assets/images/layout/Logo.png' as={Link} to='/'/>
        </Grid.Column>
        <Grid.Column width={13}>
            <Search/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="menu-bar">
        <Grid.Column width={10}>
          <Button.Group>
          {/* <Button as={Link} to='/'>Home</Button>*/}
          <Button as={Link} to='/about'>About</Button>
          <Button as={Link} to='/news'>News</Button>
          <Button as={Link} to='/replays'>Replay</Button>
          <Button as={Link} to='/scenarios'>Scenario</Button>            
          </Button.Group>
        </Grid.Column>
        <Grid.Column width={6}>
          <Button.Group className="user-buttons">
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/library'>Library</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to={`/user/${props.currentUser!=null?props.currentUser.userName:null}`}>Profile</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/user'>MyInfo</Button>:null}
          {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)&&props.currentUser!=undefined?<Button as={Link} to='/logout'>Logout</Button>:<Button as={Link} to='/login'>Login</Button>} 
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </ul>
</nav>);
}
export default Navbar