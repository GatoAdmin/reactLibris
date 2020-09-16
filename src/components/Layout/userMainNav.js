import React from 'react';
import { Button,Grid, Menu } from 'semantic-ui-react'
import {Link } from 'react-router-dom';

function Navbar (props){
  return (<nav className='Menu-wrapper'>
  <ul>
    <Grid>
        <Grid.Column width={3} className="sideMenu">
            <Button.Group vertical>
                <Button as={Link} to='/library'>Home</Button>{/* <Link to='/'><li>Home</li></Link> */}
                <Button as={Link} to='/library/bookmark/scenarios'>BookmarkScenarios</Button>
                <Button as={Link} to='/library/bookmark/replays'>BookmarkReplays</Button>
                <Button as={Link} to='/library/block/scenarios'>BlockScenarios</Button>
                <Button as={Link} to='/library/block/replays'>BlockReplays</Button>
                <Button as={Link} to='/library/block/user'>BlockUsers</Button>
                <Button as={Link} to='/library/comments'>MyComments</Button>
                <Button as={Link} to='/library/chronicles'>MyChronicles</Button>
            </Button.Group>
        </Grid.Column>
    </Grid>
  </ul>
</nav>);
}
export default Navbar