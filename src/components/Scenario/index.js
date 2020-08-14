import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './scenarioArticleList'

class Scenario extends React.Component {
  render() {
  return (
      <div>
      <span>시나리오</span>
      <Link to='/scenarios/make'>새로 만들기</Link>
      <div>
        <Switch>
            
        </Switch>
        <ArticleList/>
      </div>
      </div>
  );
}
}
export default Scenario;
