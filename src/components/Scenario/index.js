import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './scenarioArticleList'
import Maker from './scenarioMaker';
import Viewer from './viewer';
import Editor from './scenarioEditor';
import AuthRoute from '../Layout/AuthRoute';

function Scenario({ currentUser, match })  {
  return (
      <div>
        <h1>시나리오</h1>
        <div>
          <Route exact path={match.path} component={(props)=><ArticleList currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>} />
          <AuthRoute
                currentUser={currentUser}
                path={`${match.path}/make`}
                render={(props)=><Maker currentUser={currentUser} {...props}/>}
              />   
        <AuthRoute
                currentUser={currentUser}
                path={`${match.path}/edit/:id`}
                render={(props)=><Editor currentUser={currentUser} {...props}/>}  
              />                 
       </div>
      </div>
  );
}
export default Scenario;
