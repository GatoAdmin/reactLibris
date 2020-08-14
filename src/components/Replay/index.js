import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ArticleList from './replayArticleList'

class Replay extends React.Component {
  render() {
  return (
      <div>
      <span>리플레이</span>
      <Link to='/replays/make'>새로 만들기</Link>
      <div>
        <Switch>
            
        </Switch>
        <ArticleList/>
      </div>
      </div>
  );
}
}
export default Replay;
