import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button,Input, Menu } from 'semantic-ui-react'
import AuthRoute from '../AuthRoute';
import LibraryHome from './home';
import Bookmarks from './bookmarks';
import Blocks from './blocks';

function Library({ currentUser, match }) {
  return (
    <div>
      <nav className="sideMenu">
        <ul>
          <Button.Group>
            <Button as={Link} to='/library'>Home</Button>{/* <Link to='/'><li>Home</li></Link> */}
            <Button as={Link} to='/library/bookmark/scenarios'>BookmarkScenarios</Button>
            <Button as={Link} to='/library/bookmark/replays'>BookmarkReplays</Button>
            <Button as={Link} to='/library/block/scenarios'>BlockScenarios</Button>
            <Button as={Link} to='/library/block/replays'>BlockReplays</Button>
            <Button as={Link} to='/library/block/user'>BlockUsers</Button>
             {/*<Button as={Link} to='/library/'>Scenario</Button> */}
            {/* {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)?<Button as={Link} to='/logout'>Logout</Button>:<Button as={Link} to='/login'>Login</Button>} */}
          </Button.Group>
        </ul>

      </nav>
      <div>
        {/* <Route exact path={match.path} component={ArticleList} /> */}
        <Route exact path={match.path} component={(props)=><LibraryHome currentUser={currentUser}{...props}/>}  />
        <AuthRoute
                currentUser={currentUser}
                path={[`${match.path}/bookmark/scenarios`,`${match.path}/bookmark/replays`]}
                render={(props)=><Bookmarks currentUser={currentUser}{...props}/>}
              />       
        <AuthRoute
              currentUser={currentUser}
              path={[`${match.path}/block/scenarios`,`${match.path}/block/replays`,`${match.path}/block/user`]}
              render={(props)=><Blocks currentUser={currentUser}{...props}/>}
            />
      </div>
    </div>
  );
}
export default Library;
