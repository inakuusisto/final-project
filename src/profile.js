import React from 'react';
import axios from 'axios';
const awsS3Url = "https://s3.amazonaws.com/inasocial";
import { Link } from 'react-router';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    };


    render() {
        return (
            <div id='profile-container'>
            <NavBar />
            <p>Profile</p>
            </div>
        );
    }
}


function NavBar() {
    return (
        <div>
        <ul>
            <li><Link to='/'>Home</Link></li>
        </ul>
        </div>
    );
}
