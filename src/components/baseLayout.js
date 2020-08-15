import React from 'react';
import './Main/style.css';
import {Switch, Route, Link} from 'react-router-dom';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';
import Main from './Main';
import About from './About';
import NotFound from './NotFound';
import ReplayMain from './Replay';
import ReplayMake from './Replay/Make'
import Scenario from './Scenario';
import Profile from './Profile';

class BaseLayout extends React.Component {
  render() {
  return (
    <div className="base">
    <header>
        <nav className='Menu-wrapper'>
          <ul>
            <Button.Group>
            <Button as={Link} to='/'>Home</Button>{/* <Link to='/'><li>Home</li></Link> */}
            <Button as={Link} to='/about'>about</Button>
            <Button as={Link} to='/user/설묘'>Profile</Button>
            <Button as={Link} to='/replays'>Replay</Button>
            <Button as={Link} to='/scenarios'>Scenario</Button>
            </Button.Group>
          </ul>
        </nav>
    </header>
        <div className='Contents-wrapper'>
        <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/about" component={About} />
              <Route exact path="/replays/:path?">
                <Switch>
                  <Route exact path="/replays" component={ReplayMain} />
                  <Route exact path="/replays/make" component={ReplayMake} />
                </Switch>
              </Route> 
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
