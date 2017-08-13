import React from 'react';
import { Link } from 'react-router';
import { NavBar } from './profile';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render(props) {

        return (
            <div id='home-container'>
            <NavBar />
            </div>
        );
    }
}
