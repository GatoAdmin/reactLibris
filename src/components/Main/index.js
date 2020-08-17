import React from 'react';
import {Button, List}from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import Landing from './landing';
import Home from './home';

function Main({ match })  {
  return (
      <div>
        <div>
          {/* <Route exact path={match.path} component={this.props.currentUser!=undefined?Home:Landing} /> */}
          <Route exact path={match.path} component={Landing} />
        </div>
      </div>
  );
}
export default Main;
