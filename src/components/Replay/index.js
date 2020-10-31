import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './replayArticleList'
import Maker from './replayMaker';
import Viewer from './viewer';
import Editor from './replayEditor';
import AuthRoute from '../Layout/AuthRoute';

function Replay({ currentUser, match }) {
  return (
      <div>
        <div>
          <Route exact path={match.path} component={(props)=><ArticleList currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>}  />
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
export default Replay;
