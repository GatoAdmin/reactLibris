import React from 'react';
import {Button, List}from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import { useCookies , Cookies } from 'react-cookie';
import Landing from './landing';
import Home from './home';

function Main({ currentUser,match })  {
  const [cookies, setCookie] = useCookies(['libris_visite']);
  // var is_visite = cookies.get('libris_visite')||false; 
  console.log(cookies.libris_visite);
  return (
      <div>
        <div>
          <Route exact path={match.path} component={typeof(currentUser) === 'object'&&!Array.isArray(currentUser)&&currentUser!==undefined?Home:cookies.libris_visite?Home:Landing} />
        </div>
      </div>
  );
}
export default Main;
