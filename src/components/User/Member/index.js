import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import {Grid} from 'semantic-ui-react';
import AuthRoute from '../../Layout/AuthRoute';
import SideNav from '../../Layout/userMainNav';
import MyInfo from './myInfo';
function User({currentUser, match })  {
  return (
      <Grid>
        <Grid.Column width={4}>
            <SideNav currentUser={currentUser}/>
        </Grid.Column>
        <Grid.Column width={10}>
          {/* <Route exact path={match.path} component={ArticleList} /> */}
          <AuthRoute 
              exact path={`${match.path}`} 
              currentUser={currentUser}      
              render={(props)=><MyInfo currentUser={currentUser}{...props}/>} 
          />
        </Grid.Column>
      </Grid>
  );
}
export default User;
