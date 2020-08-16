import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './replayArticleList'
// import Make from './maker';
import Viewer from './viewer';

function Replay({ match }) {
  return (
      <div>
        <h1>Replay</h1>
        <div>
          <Route exact path={match.path} component={ArticleList} />
          <Route path={`${match.path}/view/:id`} component={Viewer} />
        </div>
      </div>
  );
}
export default Replay;
