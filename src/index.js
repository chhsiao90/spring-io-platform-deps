import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import App from './components/App';
import Compare from './components/Compare';

render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <Route path='/compare' component={Compare} />
        </Route>
    </Router>
), document.getElementById('root'));
