import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Home from './home';
import Registration from './registration';
import Login from './login';
import Profile from './profile';
import LoggedinHome from './loggedinHome';
import Inbox from './inbox';


if (location.pathname == '/home') {
    const router = (
        <Router history={hashHistory}>
            <Route path="/" component={Home} />
      	    <Route path="/register" component={Registration} />
            <Route path="/login" component={Login} />
        </Router>
    );

    ReactDOM.render(router, document.querySelector('main'));

} else {

    const router = (
        <Router history={browserHistory}>
            <Route path="/" component={LoggedinHome} />
            <Route path="/profile" component={Profile} />
            <Route path="/inbox" component={Inbox} />
        </Router>
    );

    ReactDOM.render(router, document.querySelector('main'));

}
