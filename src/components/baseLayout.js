import React from 'react';
import './Main/style.css';
import {Switch, Route, Link} from 'react-router-dom';
import Main from './Main';
import About from './About';
import NotFound from './NotFound';
import Replay from './Replay';
import Scenario from './Scenario';
import Profile from './Profile';

class BaseLayout extends React.Component {
  render() {
  return (
    <div className="base">
    <header>
        <nav className='Menu-wrapper'>
          <ul>
            <Link to='/'><li>Home</li></Link>
            <Link to='/about'><li>about</li></Link>
            <Link to='/user/설묘'><li>Profile</li></Link>
            <Link to='/replays'><li>Replay</li></Link>
            <Link to='/scenarios'><li>Scenario</li></Link>
          </ul>
        </nav>
    </header>
        <div className='Contents-wrapper'>
        <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/about" component={About} />
              <Route path="/replays" component={Replay} />
              <Route path="/scenarios" component={Scenario} /> 
              <Route path="/user/설묘" component={Profile} />
              <Route component={NotFound} />

        </Switch>
        </div>
    <footer>
        React Router v5 Browser Example (c) 2017
    </footer>
  </div>
  );}
}
export default BaseLayout;
