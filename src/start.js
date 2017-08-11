import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import App from './app';
import Registration from './registration';
import Login from './login';


const router = (
    <Router history={hashHistory}>
        <Route path="/" component={App} />
  	    <Route path="/register" component={Registration} />
        <Route path="/login" component={Login} />
    </Router>
);

ReactDOM.render(router, document.querySelector('main'));



// ReactDOM.render(
//     <HelloWorld />,
//     document.querySelector('main')
// );
//
// function HelloWorld() {
//     return (
//         <div>Hello, World!</div>
//     );
// }
