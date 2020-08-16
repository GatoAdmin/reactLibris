import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './scenarioArticleList'
import Viewer from './viewer';

function Scenario({ match })  {
  return (
      <div>
        <h1>Scenario</h1>
        <div>
          <Route exact path={match.path} component={ArticleList} />
          <Route path={`${match.path}/view/:id`} component={Viewer} />
        </div>
      </div>
  );
}
export default Scenario;
