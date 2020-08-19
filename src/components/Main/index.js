import React from 'react';
import {Button, List}from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import Landing from './landing';
import Home from './home';

function Main({ currentUser,match })  {
  return (
      <div>
        <div>
          <Route exact path={match.path} component={typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=undefined?Home:Landing} />
          {/* <Route exact path={match.path} component={Landing} /> */}
        </div>
      </div>
  );
}
export default Main;
