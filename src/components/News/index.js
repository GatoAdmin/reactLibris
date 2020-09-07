import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './newsArticleList'
import Viewer from './viewer';

function News({ currentUser, match }) {
  return (
      <div>
        <h1>News</h1>
        <div>
          <Route exact path={match.path} component={(props)=><ArticleList currentUser={currentUser} {...props}/>} />
          <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>}  />
        </div>
      </div>
  );
}
export default News;
