import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button,Input, Menu } from 'semantic-ui-react'
import ReplayChronicles from './chronicleReplays';
import ScenarioChronicles from './chronicleScenarios';

function Chronicles({ currentUser, match }) {
  return (
    <div>
      <div>
      <Route exact path={`${match.path}/scenarios/:id`} component={(props)=><ScenarioChronicles currentUser={currentUser}{...props}/>}  />
      <Route exact path={`${match.path}/replays/:id`} component={(props)=><ReplayChronicles currentUser={currentUser}{...props}/>}  />
        {/* <AuthRoute
                currentUser={currentUser}
                path={[`${match.path}/bookmark/scenarios`,`${match.path}/bookmark/replays`]}
                render={(props)=><Bookmarks currentUser={currentUser}{...props}/>}
              />        */}
      </div>
    </div>
  );
}
export default Chronicles;
