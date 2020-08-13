import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';
import * as serviceWorker from './serviceWorker';

import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
ReactDOM.render(

  <BrowserRouter>
        <div className='Menu-wrapper'>
          <ul>
            <Link to='/'><li>Home</li></Link>
            <Link to='/about'><li>about</li></Link>
          </ul>
        </div>
        <div className='Contents-wrapper'>
        <Switch>

              <Route exact path="/" component={App} />
              <Route path="/about" component={About} />
              <Route component={NotFound} />

        </Switch>
        </div>

 </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
