import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import Profile from './profile';
import ProfileEditor from './userProfileEdit';
import CalrendarEditor from './calendarEdit';
import AuthRoute from '../Layout/AuthRoute';
function User({currentUser, match })  {
  return (
      <div>
        <div>
          {/* <Route exact path={match.path} component={ArticleList} /> */}
          <Route exact path={`${match.path}/:userName`} component={(props)=><Profile currentUser={currentUser}{...props}/>} />
          <AuthRoute
                currentUser={currentUser}
                path={`${match.path}/:userName/edit`}
                render={(props)=><ProfileEditor currentUser={currentUser}{...props}/>}
              />   
          <AuthRoute 
              exact path={`${match.path}/:userName/calendar`} 
              currentUser={currentUser}      
              render={(props)=><CalrendarEditor currentUser={currentUser}{...props}/>} 
          />
           
        </div>
      </div>
  );
}
export default User;
