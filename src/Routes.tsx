import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import FilePage from './containers/FilePage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route exact path={routes.HOME} component={HomePage} />
        <Route path={`${routes.FILE}/:docId`} component={FilePage} />
      </Switch>
    </App>
  );
}
