import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            contactFirst: '',
            contactLast: '',
            email: '',
            password: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    };

    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        axios.post('/register', {
            name: this.state.name,
            contactFirst: this.state.contactFirst,
            contactLast: this.state.contactLast,
            email: this.state.email,
            password: this.state.password
        }).then(({data}) => {
            if(data.success) {
                console.log('success')
                location.replace('/profile');
            } else {
                this.setState({
                    error: true
                });
            }
        }).catch(() => {
            this.setState({
                error: true
            });
        });

    }

    render() {
        return (
            <div id='reg-container'>
            <h1 id='reg-header'>Welcome to register to our site!</h1>
            <p id='reg-text'>Please fill out the form</p>
            {this.state.error && <p className="error-message">Oops, something went wrong. Please try again!</p>}
            <form onSubmit={this.handleSubmit}>
            <input className='reg-input' type="text" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder="Organisation name" required /><br />
            <input className='reg-input' type="text" name="contactFirst" value={this.state.contactFirst} onChange={this.handleInputChange} placeholder="Contact - First name" required /><br />
            <input className='reg-input' type="text" name="contactLast" value={this.state.contactLast} onChange={this.handleInputChange} placeholder="Contact - Last name" required /><br />
            <input className='reg-input' type="text" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email" required /><br />
            <input className='reg-input' type='password' name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Password" required /><br />
            <input className='reg-button' type="submit" value="Submit" />
            </form>
            </div>

        );

    }

}
