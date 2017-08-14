import React from 'react';
import axios from 'axios';
const awsS3Url = "https://s3.amazonaws.com/inafinal";
import { Link } from 'react-router';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageInput: '',
            description: '',
            addressInput: '',
            urlInput: '',
            aboutInput: ''
        };

        this.showUploader = this.showUploader.bind(this);
        this.hidePicUpload = this.hidePicUpload.bind(this);
        this.submit = this.submit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showEditAddress = this.showEditAddress.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.editAddress = this.editAddress.bind(this);
        this.showEditUrl = this.showEditUrl.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.editUrl = this.editUrl.bind(this);
        this.showEditAbout = this.showEditAbout.bind(this);
        this.editAbout = this.editAbout.bind(this);
        this.handleAboutChange = this.handleAboutChange.bind(this);
    };

    componentDidMount() {

        axios.get('/organisation').then(({data}) => {
            this.setState({
                organisationId: data.id,
                name: data.name,
                contactFirst: data.contact_first,
                contactLast: data.contact_last,
                profilePicUrl: data.image ? awsS3Url + '/' + data.image : '../images/profile.png',
                address: data.address,
                url: data.url,
                about: data.about
            })
        }).catch((error) => {
            console.log(error);
        });

    }

    showEditAddress() {
        this.setState({editAddressVisible: true})
    }

    showEditUrl() {
        this.setState({editUrlVisible: true})
    }

    showEditAbout() {
        this.setState({editAboutVisible: true})
    }

    showUploader() {
        this.setState({uploadDialogVisible: true})
    }

    hidePicUpload() {
        this.setState({uploadDialogVisible: false})
    }


    handleAddressChange(event) {
        this.setState({
            addressInput: event.target.value
        });
    }

    handleUrlChange(event) {
        this.setState({
            urlInput: event.target.value
        });
    }

    handleAboutChange(event) {
        this.setState({
            aboutInput: event.target.value
        });
    }

    handleChange(event) {
        this.setState({
            messageInput: event.target.value
        });
    }

    handleInputChange(event) {
        this.setState({
            description: event.target.value
        });
    }


    editAddress(event) {
        event.preventDefault();
        // alert(this.state.addressInput);

        axios.post('/address', {
            address: this.state.addressInput
        })
        .then(({data}) => {
            console.log(data);
            if(data.success) {
                this.setState({
                    editAddressVisible: false,
                    address: data.address
                })
            }
        }).catch(function (error) {
            console.log(error);
        });

    }


    editUrl(event) {
        event.preventDefault();
        // alert(this.state.urlInput);

        axios.post('/url', {
            url: this.state.urlInput
        })
        .then(({data}) => {
            console.log(data);
            if(data.success) {
                this.setState({
                    editUrlVisible: false,
                    url: data.url
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    editAbout(event) {
        event.preventDefault();
        // alert(this.state.aboutInput);

        axios.post('/about', {
            about: this.state.aboutInput
        })
        .then(({data}) => {
            console.log(data);
            if(data.success) {
                this.setState({
                    editAboutVisible: false,
                    about: data.about
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }


    submit(event) {

        // console.log(event.target.files[0]);
        // alert(this.state.organisationId);

        var file = event.target.files[0];
        var organisationId = this.state.organisationId;

        var formData = new FormData();

        formData.append('file', file);
        formData.append('organisationId', organisationId);

        axios({
            method: 'post',
            url: '/upload',
            data: formData
        })
        .then(({data}) => {
            // console.log(data.fileName);
            if(data.success) {
                this.setState({
                    uploadDialogVisible: false,
                    profilePicUrl: awsS3Url + '/' + data.fileName
                })
            }
        }).catch(function (error) {
            console.log(error);
        });

    }


    handleSubmit(event) {
        event.preventDefault();
        // alert('Value ' + this.state.messageInput);
        // alert('Value ' + this.state.description);

        axios.post('/post', {
            organisationId: this.state.organisationId,
            description: this.state.description,
            message: this.state.messageInput
        })
        .then(({data}) => {
            console.log(data);
            if(data.success) {
                this.setState({
                    showPost: true,
                    postDescription: data.description,
                    postMessage: data.message,
                    messageInput: '',
                    description: ''
                })
            }
        }).catch(function (error) {
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
            {!this.state.address && <p onClick={this.showEditAddress}>Add address</p>}
            {this.state.address && <p>{this.state.address}</p>}
            {this.state.address && <p onClick={this.showEditAddress}>Edit</p>}
            {this.state.editAddressVisible && <AddressEdit editAddress={this.editAddress} value={this.state.addressInput} handleAddressChange={this.handleAddressChange} />}
            {!this.state.url && <p onClick={this.showEditUrl}>Add website</p>}
            {this.state.url && <p>{this.state.url}</p>}
            {this.state.url && <p onClick={this.showEditUrl}>Edit</p>}
            {this.state.editUrlVisible && <UrlEdit editUrl={this.editUrl} value={this.state.urlInput} handleUrlChange={this.handleUrlChange} />}
            {!this.state.about && <p onClick={this.showEditAbout}>Tell more about your organisation</p>}
            {this.state.about && <p>{this.state.about}</p>}
            {this.state.about && <p onClick={this.showEditAbout}>Edit</p>}
            {this.state.editAboutVisible && <AboutEdit editAbout={this.editAbout} value={this.state.aboutInput} handleAboutChange={this.handleAboutChange} />}
            <img id='big-profile-pic' src={this.state.profilePicUrl} alt={this.state.name} onClick={this.showUploader} />
            {this.state.uploadDialogVisible && <ProfilePicUpload submit={this.submit} hidePicUpload={this.hidePicUpload} />}
            </div>
            <div id='clear'></div>
            {this.state.showPost && <Post postDescription={this.state.postDescription} postMessage={this.state.postMessage} profilePicUrl={this.state.profilePicUrl} name={this.state.name} />}
            <MakePost handleSubmit={this.handleSubmit} value={this.state.messageInput} value={this.state.description} handleChange={this.handleChange} handleInputChange={this.handleInputChange} />
            </div>
        );
    }
}


export function NavBar() {
    return (
        <div>
        <ul>
        <li><img id='logo' src='../images/logo.png' /></li>
        <li><p id='nav-heading'>Bliiblaa</p></li>
        <li id='home-link'><Link to='/'>Home</Link></li>
        </ul>
        </div>
    );
}


function AddressEdit(props) {
    return (
        <form onSubmit={props.editAddress}>
        <input className='reg-input' type="text" name="address" value={props.addressInput} onChange={props.handleAddressChange} /><br />
        <input type="submit" value="Save" />
        </form>
    );
}


function UrlEdit(props) {
    return (
        <form onSubmit={props.editUrl}>
        <input className='reg-input' type="text" name="url" value={props.urlInput} onChange={props.handleUrlChange} /><br />
        <input type="submit" value="Save" />
        </form>
    );
}

function AboutEdit(props) {
    return (
        <form onSubmit={props.editAbout}>
        <input className='reg-input' type="text" name="about" value={props.aboutInput} onChange={props.handleAboutChange} /><br />
        <input type="submit" value="Save" />
        </form>
    );
}


function ProfilePicUpload(props) {
    return (
        <div id='profile-pic-upload-container'>
        <p id="hide-upload" onClick={props.hidePicUpload}>X</p>
        <h3>Change your organisation image</h3>
        <div id="pic-file-upload">
        <span>Upload</span>
        <input type="file" id="pic-upload-button" onChange={props.submit} />
        </div>
        </div>
    );
}

function MakePost(props) {
    return (
        <div>
        <p id='post-text'>Please make your post with a short description here to be shown in the front page</p>
        <div id='post-container'>
        <form onSubmit={props.handleSubmit}>
        <input id='description-input' type="text" name="description" value={props.description} onChange={props.handleInputChange} placeholder="Short description of your need" required /><br />
        <textarea id='message-textarea' value={props.messageInput} onChange={props.handleChange} placeholder="Your message..." required /><br />
        <input id="post-button" type="submit" value="Send" />
        </form>
        </div>
        </div>
    );
}


function Post(props) {
    return (
        <div>
        <p id='thanks-for-post-text'>Thank you for your post! </p>
        <div id='post-made'>
        <img id='small-profile-pic' src={props.profilePicUrl} alt={props.name} />
        <div id='post-made-text'>
        <p id='post-description'>{props.postDescription}</p>
        <p>{props.postMessage}</p>
        </div>
        <div id='clear'></div>
        </div>
        </div>
    )
}
