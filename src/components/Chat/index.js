import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import ChatWindow from './chatWindow'
// import Viewer from './viewer';

function Chat({ currentUser, match }) {
  return (
      <div>
        <div>
          <Route exact path={match.path} component={(props)=><ChatWindow currentUser={currentUser} {...props}/>} />
          {/* <Route path={`${match.path}/view/:id`} component={(props)=><Viewer currentUser={currentUser} {...props}/>}  /> */}
        </div>
      </div>
  );
}
export default Chat;
