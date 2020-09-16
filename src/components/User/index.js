import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import AuthRoute from '../Layout/AuthRoute';
import SideNav from '../Layout/userMainNav';
import Profile from './Profile/profile';
import ProfileEditor from './Profile/userProfileEdit';
import CalrendarEditor from './Profile/calendarEdit';
import MyInfo from './Member/myInfo';
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
          <AuthRoute 
              exact path={`${match.path}/`} 
              currentUser={currentUser}      
              render={(props)=><MyInfo currentUser={currentUser}{...props}/>} 
          />
        </div>
      </div>
  );
}
export default User;
