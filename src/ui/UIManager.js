import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import App from './App.jsx';
import About from './About.jsx';
import Shop from './shop/Shop.jsx';
import NoMatch from './NoMatch.jsx';

import './app.scss';

ReactDOM.render(
	<Router history={browserHistory}>
		<Route component={App}>
			<Route path="/"  />
			<Route path="about" component={About} />
			<Route path="shop" component={Shop} />
			<Route path="*" component={NoMatch} />
		</Route>
	</Router>
	, document.getElementById('root'));
