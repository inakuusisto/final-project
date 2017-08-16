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



//
// const router = (
//     <Router history={hashHistory}>
//         <Route path="/" component={Home} />
//   	    <Route path="/register" component={Registration} />
//         <Route path="/login" component={Login} />
//         <Route path="/profile" component={Profile} />
//     </Router>
// );
//
// ReactDOM.render(router, document.querySelector('main'));





//
// if (location.pathname == '/home') {
//     const router = (
//         <Router history={hashHistory}>
//             <Route path="/" component={App} />
//       	    <Route path="/register" component={Registration} />
//             <Route path="/login" component={Login} />
//         </Router>
//     );
//
//     ReactDOM.render(router, document.querySelector('main'));
// }

// } else {
//
//     const router = (
//         <Provider store={store}>
//         <Router history={browserHistory}>
//         <Route path="/" component={App}>
//         <IndexRoute component={Profile} />
//         <Route path="/user/:id" component={Otheruserprofile}/>
//         <Route path="/friends" component={Friends}/>
//         <Route path="/online" component={Online}/>
//         <Route path="/chat" component={Chat}/>
//         </Route>
//         </Router>
//         </Provider>
//     );
//
//     ReactDOM.render(router, document.querySelector('main'));
//
// }


//
// const router = (
//     <Router history={hashHistory}>
//         <Route path="/" component={App} />
//   	    <Route path="/register" component={Registration} />
//         <Route path="/login" component={Login} />
//     </Router>
// );
//
// ReactDOM.render(router, document.querySelector('main'));


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
