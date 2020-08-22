import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import Profile from './profile';
import ProfileEditor from './userProfileEdit';

function User({currentUser, match })  {
  return (
      <div>
        <div>
          {/* <Route exact path={match.path} component={ArticleList} /> */}
          <Route exact path={`${match.path}/:userName`} component={(props)=><Profile currentUser={currentUser}{...props}/>} />
          <Route path={`${match.path}/:userName/edit`} component={(props)=><ProfileEditor currentUser={currentUser}{...props}/>} />
        </div>
      </div>
  );
}
export default User;
