import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './replayArticleList'
import Make from './replayMake';
import Viewer from './viewer';

function Replay({ currentUser, match }) {
  return (
      <div>
        <h1>Replay</h1>
        <div>
          <Route exact path={match.path} component={(props)=><ArticleList currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>}  />
          <Route path={`${match.path}/make`} component={(props)=><Make currentUser={currentUser} {...props}/>}  />
        </div>
      </div>
  );
}
export default Replay;
