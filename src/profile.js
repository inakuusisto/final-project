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

    componentDidMount() {

        axios.get('/organisation').then(({data}) => {
            this.setState({
                organisationId: data.id,
                name: data.name,
                contactFirst: data.contact_first,
                contactLast: data.contact_last,
                profilePicUrl: data.image ? awsS3Url + '/' + data.image : '../images/profile.png'
            })
        }).catch((error) => {
            console.log(error);
        });

    }


    render() {
        return (
            <div id='profile-container'>
            <NavBar />
            <div id='profile-content'>
            <p id='organisation-name'>{this.state.name}</p>
            <p id='contact-person'> Contact person: {this.state.contactFirst} {this.state.contactLast}</p>
            <img id='big-profile-pic' src={this.state.profilePicUrl} />
            </div>
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
