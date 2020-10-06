import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button,Input, Grid } from 'semantic-ui-react'
import AuthRoute from '../Layout/AuthRoute';
import LibraryHome from './home';
import Bookmarks from './bookmarks';
import Blocks from './blocks';
import Comments from './comments';
import Chronicles from './chronicles';
import ReportAritcle from './reportAritcle';

function Library({ currentUser, match }) {
  return (
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
            <Button as={Link} to='/library/sanctions'>제한 사항</Button>
            {/* {typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)?<Button as={Link} to='/logout'>Logout</Button>:<Button as={Link} to='/login'>Login</Button>} */}
          </Button.Group>
      </Grid.Column>
      <Grid.Column width={10} >
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
        <AuthRoute
              currentUser={currentUser}
              path={`${match.path}/comments`}
              render={(props)=><Comments currentUser={currentUser}{...props}/>}
          />
          <AuthRoute
                currentUser={currentUser}
                path={`${match.path}/chronicles`}
                render={(props)=><Chronicles currentUser={currentUser}{...props}/>}
          />
          <AuthRoute
                currentUser={currentUser}
                path={`${match.path}/sanctions`}
                render={(props)=><ReportAritcle currentUser={currentUser}{...props}/>}
          />
      </Grid.Column>
    </Grid>
  );
}
export default Library;
