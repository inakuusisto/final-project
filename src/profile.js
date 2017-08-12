import React from 'react';
import axios from 'axios';
const awsS3Url = "https://s3.amazonaws.com/inafinal";
import { Link } from 'react-router';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageInput: '',
            description: ''
        };

        this.showUploader = this.showUploader.bind(this);
        this.hidePicUpload = this.hidePicUpload.bind(this);
        this.submit = this.submit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

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

    showUploader() {
        this.setState({uploadDialogVisible: true})
    }

    hidePicUpload() {
        this.setState({uploadDialogVisible: false})
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
                // this.setState({
                //     editBioVisible: false
                // })
                // window.location.reload()
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
            <img id='big-profile-pic' src={this.state.profilePicUrl} alt={this.state.name} onClick={this.showUploader} />
            {this.state.uploadDialogVisible && <ProfilePicUpload submit={this.submit} hidePicUpload={this.hidePicUpload} />}
            </div>
            <div id='clear'></div>
            <MakePost handleSubmit={this.handleSubmit} value={this.state.messageInput} value={this.state.description} handleChange={this.handleChange} handleInputChange={this.handleInputChange} />
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
        <div id='post-container'>
        <form onSubmit={props.handleSubmit}>
        <input id='description-input' type="text" name="description" value={props.description} onChange={props.handleInputChange} required /><br />
        <textarea id='message-textarea' value={props.messageInput} onChange={props.handleChange} required /><br />
        <input id="message-button" type="submit" value="Send" />
        </form>
        </div>
    );
}
