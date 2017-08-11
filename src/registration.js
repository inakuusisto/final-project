import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    };

    render() {
        return (
            <div id='reg-container'>
            <h1 id='reg-header'>Welcome to register to our site!</h1>
            <p id='reg-text'>Please fill out the form</p>
            <form>
            <input className='reg-input' type="text" name="name" placeholder="Organisation name" required /><br />
            <input className='reg-input' type="text" name="contact" placeholder="Contact person" required /><br />
            <input className='reg-input' type="text" name="email" placeholder="Email" required /><br />
            <input className='reg-input' type='password' name="password" placeholder="Password" required /><br />
            <input className='reg-button' type="submit" value="Submit" />
            </form>
            </div>

        );

    }

}
