import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/route/PrivateRoute';
import UnauthenticatedRoute from './components/route/UnauthenticatedRoute';
import Home from './components/Home';
import Private from './components/Private';
import NavBar from './components/NavBar';
import Machines from './components/Machines';
import Console from './components/Console';
import Login from './components/auth/Login';
import Authorize from './components/auth/Authorize';
import Production from './components/Production';
import NotFound from './components/NotFound';
import Downtime from './components/Downtime';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Private>
        <NavBar />
      </Private>
      <Switch>
        <UnauthenticatedRoute
          exact
          path="/login"
          component={Login}
        />
        <UnauthenticatedRoute
          exact
          path="/authorize/mm/callback"
          component={Authorize}
        />
        <PrivateRoute
          exact
          path="/"
          component={Home}
        />
        <PrivateRoute
          exact
          path="/machines"
          component={Machines}
        />
        <PrivateRoute
          exact
          path="/console"
          component={Console}
        />
        <PrivateRoute
          exact
          path="/production"
          component={Production}
        />
        <PrivateRoute
          exact
          path="/downtime"
          component={Downtime}
        />
        <Route
          component={NotFound}
        />
      </Switch>
    </Router>
  );
}

export default App;
