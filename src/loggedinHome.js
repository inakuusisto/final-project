import React from 'react';
import { Link } from 'react-router';
import axios from './axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            name: '',
            description: '',
            message: '',
            about: '',
            address: '',
            url: '',
            organisationId: '',
            senderName: '',
            senderEmail: '',
            subject: '',
            privateMessage: ''
        };

        this.closeMoreInfo = this.closeMoreInfo.bind(this);
        this.closeContactForm = this.closeContactForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideThankYou = this.hideThankYou.bind(this);
    }

    componentDidMount() {
        console.log('hello');
        axios.get('/posts').then(({data}) => {
            console.log(data);
            this.setState({
                posts: data
            })
        }).catch((error) => {
            console.log(error);
        });

    }

    closeMoreInfo() {
        this.setState({
            showMoreVisible: false,
            imageUrl: '',
            name: '',
            description: '',
            about: '',
            address: '',
            url: ''
        })
    }


    componentDidUpdate() {
        window.scrollTo(0,0);
    }


    hideThankYou() {
        this.setState({showThankYou: false})
    }


    getComponent(object) {

        // alert(object.id);
        this.setState({
            showMoreVisible: true,
            showContactVisible: false,
            showThankYou: false,
            imageUrl: object.image,
            name: object.name,
            description: object.description,
            message: object.message,
            about: object.about,
            address: object.address,
            url: object.url
        })
    }


    startContact(object) {

        // alert(object.id);
        this.setState({
            showContactVisible: true,
            organisationId: object.id,
            imageUrl: object.image,
            name: object.name,
            showMoreVisible: false,
            showThankYou: false
        })
    }

    closeContactForm() {
        this.setState({
            showContactVisible: false,
            organisationId: '',
            imageUrl: '',
            name: ''
        })
    }


    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    handleChange(event) {
        this.setState({
            privateMessage: event.target.value
        });
    }


    handleSubmit(event) {
        event.preventDefault();

        axios.post('/message', {
            organisationId: this.state.organisationId,
            senderName: this.state.senderName,
            senderEmail: this.state.senderEmail,
            subject: this.state.subject,
            privateMessage: this.state.privateMessage
        })
        .then(({data}) => {
            console.log(data);
            if(data.success) {
                this.setState({
                    organisationId: '',
                    senderName: '',
                    senderEmail: '',
                    subject: '',
                    privateMessage: '',
                    showContactVisible: false,
                    showThankYou: true
                })
            }
        }).catch(function (error) {
            console.log(error);
        });

    }


    render(props) {

        if(!this.state.posts) {
            return null;
        }

        console.log(this.state.posts);

        const posts = (
            <div id='loggedin-home-posts-container'>
            {this.state.posts.map((post) =>
                <div className='home-post-container'>
                <img className='home-posts-image' src={post.image ? post.image : '../images/profile.png'} alt={post.name} />
                <div className='home-post-text'>
                <p className='home-post-description'>{post.description}</p>
                <p>{post.message}</p>
                <p className='home-more' onClick={this.getComponent.bind(this, post)}>View</p>
                <p className='home-contact' onClick={this.startContact.bind(this, post)}>Contact</p>
                <div id='clear'></div>
                </div>
                </div>
            )}
            </div>
        )


        return (
            <div id='home-container'>
            <NavBarLoggedin />
            <div id='home-about-container'>
            <div id='home-berliner-container'>
            <h2>Berliner</h2>
            <div id='home-berliner-text'>
            <p>You would like to help but don´t know what kind of donations are needed and where?</p>
            <p id='home-berliner-bold'>Have a look at the posts below</p>
            </div>
            </div>
            <div id='home-organisation-container'>
            <div id='home-organisation-text'>
            <h2>Organisation</h2>
            <p>Your organisation would need specific donations?</p>
            <p id='home-organisation-bold'>Register and make a post</p>
            </div>
            </div>
            </div>
            {this.state.showMoreVisible && <MoreInfo imageUrl={this.state.imageUrl} name={this.state.name} description={this.state.description} closeMoreInfo={this.closeMoreInfo} message={this.state.message} about={this.state.about} address={this.state.address} url={this.state.url} />}
            {this.state.showContactVisible && <ContactForm imageUrl={this.state.imageUrl} name={this.state.name} handleSubmit={this.handleSubmit} value={this.state.senderName} value={this.state.senderEmail} value={this.state.subject} value={this.state.privateMessage} closeContactForm={this.closeContactForm} handleChange={this.handleChange} handleInputChange={this.handleInputChange} />}
            {this.state.showThankYou && <ThankYou hideThankYou={this.hideThankYou} />}
            {posts}
            </div>
        );
    }
}


function MoreInfo(props) {
    return (
        <div id='more-info-container'>
        <div id='more-info-image-text-container'>
        <img id='more-info-image' src={props.imageUrl} alt={props.name} />
        <p id='contact-form-name'>{props.name}</p>
        </div>
        <div id='more-text'>
        <p id='more-info-description'>{props.description}</p>
        <p id='more-info-message'>{props.message}</p>
        {props.about && <p className='profile-tag'>About us:</p>}
        {props.about && <p>{props.about}</p>}
        {props.address && <p className='profile-tag'>Address:</p>}
        {props.address && <p>{props.address}</p>}
        {props.url && <p className='profile-tag'>Website:</p>}
        {props.url && <p>{props.url}</p>}
        <p id="hide-more-info" onClick={props.closeMoreInfo}>Close</p>
        </div>
        </div>
    );
}



export function NavBarLoggedin() {
    return (
        <div id='nav-header-container'>
        <img id='logo' src='../images/logo.png' />
        <p id='nav-heading'>donate.berlin</p>
        <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/profile'>Profile</Link></li>
        <li><Link to='/inbox'>Inbox</Link></li>
        <li><a href="/logout" className='link'>Log Out</a></li>
        </ul>
        </div>
    );
}


function ContactForm(props) {
    return (
        <div id='contact-form-container'>
        <div id='contact-form-image-text-container'>
        <img id='contact-form-image' src={props.imageUrl} alt={props.name} />
        <p id='contact-form-name'>{props.name}</p>
        </div>
        <div id='contact-form'>
        <p id='contact-form-header'>Send a message to this organisation</p>
        <form onSubmit={props.handleSubmit}>
        <input className='contact-form-input' type="text" name="senderName" value={props.senderName} onChange={props.handleInputChange} placeholder="Name" required /><br />
        <input className='contact-form-input' type="text" name="senderEmail" value={props.senderEmail} onChange={props.handleInputChange} placeholder="Email" required /><br />
        <input className='contact-form-input' type="text" name="subject" value={props.subject} onChange={props.handleInputChange} placeholder="Subject" required /><br />
        <textarea id='contact-form-textarea' value={props.privateMessage} onChange={props.handleChange} placeholder="Your message..." required /><br />
        <input id="post-button" type="submit" value="Send" />
        </form>
        <p id="hide-more-info" onClick={props.closeContactForm}>Close</p>
        </div>
        </div>
    );
}


function ThankYou(props) {
    return (
        <div id='thank-you-container'>
        <p id="hide-thank-you" onClick={props.hideThankYou}>X</p>
        <div id='thank-you-text-container'>
        <p id='thank-you-text'>Thank you for your message!</p>
        <p>It has been sent to the organisation.</p>
        </div>
        </div>
    );
}
