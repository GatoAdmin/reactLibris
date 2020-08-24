import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button,Input, Menu } from 'semantic-ui-react'
import AuthRoute from '../Layout/AuthRoute';
import CommentViewer from './commentView';

function Comment({ currentUser, match }) {
  return (
    <div>
      <div>
        {/* <Route exact path={match.path} component={ArticleList} /> */}
        <Route exact path={`${match.path}/view/:id`} component={(props)=><CommentViewer currentUser={currentUser}{...props}/>}  />
        {/* <AuthRoute
                currentUser={currentUser}
                path={[`${match.path}/bookmark/scenarios`,`${match.path}/bookmark/replays`]}
                render={(props)=><Bookmarks currentUser={currentUser}{...props}/>}
              />        */}
      </div>
    </div>
  );
}
export default Comment;
