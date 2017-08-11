import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    };

    render() {
        return (
            <div id='login-container'>
            <h1 id='reg-header'>Please log in</h1>
            <form>
            <input className='reg-input' type="text" name="email" placeholder="Email" required /><br />
            <input className='reg-input' type='password' name="password" placeholder="Password" required /><br />
            <input className='reg-button' type="submit" value="Login" />
            </form>
            </div>

        );

    }

}
