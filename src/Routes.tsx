import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import VectorHomePage from './containers/VectorHome';
import KMeanHomePage from './containers/KMeanHome';
import KNNHomePage from './containers/KNNHome';
import BooleanHomePage from './containers/BooleanHome';
import CounterPage from './containers/CounterPage';
import FilePage from './containers/FilePage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route exact path={routes.HOME} component={KMeanHomePage} />
        <Route exact path={routes.KNN} component={KNNHomePage} />
        <Route exact path={routes.VECTORSPACE} component={VectorHomePage} />
        <Route exact path={routes.BOOLEAN} component={BooleanHomePage} />
        <Route path={`${routes.FILE}/:docId`} component={FilePage} />
      </Switch>
    </App>
  );
}
