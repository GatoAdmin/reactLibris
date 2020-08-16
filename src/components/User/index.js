import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import Profile from './profile';

function User({ match })  {
  return (
      <div>
        <div>
          {/* <Route exact path={match.path} component={ArticleList} /> */}
          <Route path={`${match.path}/:userName`} component={Profile} />
        </div>
      </div>
  );
}
export default User;
