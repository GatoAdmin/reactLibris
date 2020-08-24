import React from 'react';
import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';
import Replay from './components/Replay';
import Scenario from './components/Scenario';
import Profile from './components/Profile';

const BaseLayout = () => (
    <div className="base">
      <header>
        <p>React Router v5 Browser Example</p>
          <nav>
            <ul>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/about'>About</Link></li>
              <li>
                  <Link to='/me'>Profile</Link>
                  <Route path="/me" component={ProfileMenu} />
              </li>
              ...
  )