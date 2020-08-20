import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './scenarioArticleList'
import Maker from './scenarioMaker';
import Viewer from './viewer';
import Editor from './scenarioEditor';

function Scenario({ currentUser, match })  {
  return (
      <div>
        <h1>Scenario</h1>
        <div>
          <Route exact path={match.path} component={(props)=><ArticleList currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/make`} component={(props)=><Maker currentUser={currentUser} {...props}/>}  />
          <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/edit/:id`} component={(props)=><Editor currentUser={currentUser} {...props}/>}  />
       </div>
      </div>
  );
}
export default Scenario;
