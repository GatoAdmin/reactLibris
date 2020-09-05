import React from 'react';
import { Button,Grid, Menu } from 'semantic-ui-react'
import Search from './Search';
import {Link } from 'react-router-dom';

function Navbar (props){
  return (<nav className='Menu-wrapper'>
  <ul>
    <Grid>
      <Grid.Column width={6}>
        <Button.Group>
        <Button as={Link} to='/'>Home</Button>{/* <Link to='/'><li>Home</li></Link> */}
        <Button as={Link} to='/about'>About</Button>
        <Button as={Link} to='/replays'>Replay</Button>
        <Button as={Link} to='/scenarios'>Scenario</Button>            
        </Button.Group>
      </Grid.Column>
      <Grid.Column width={4}>
          <Search/>
      </Grid.Column>
      
      <Grid.Column width={6}>
      <Button.Group>
      {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)?<Button as={Link} to='/library'>Library</Button>:null}
      {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)?<Button as={Link} to={`/user/${props.currentUser!=null?props.currentUser.userName:null}`}>Profile</Button>:null}
      {typeof(props.currentUser) == 'object'&&!Array.isArray(props.currentUser)?<Button as={Link} to='/logout'>Logout</Button>:<Button as={Link} to='/login'>Login</Button>} 
      </Button.Group>
      </Grid.Column>
    </Grid>
  </ul>
</nav>);
}
export default Navbar