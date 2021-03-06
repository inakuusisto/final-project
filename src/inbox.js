import React from 'react';
import axios from './axios';
const awsS3Url = "https://s3.amazonaws.com/inafinal";
import { Link } from 'react-router';
import { NavBarLoggedin } from './loggedinHome';


export default class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

        axios.get('/privatemessages').then(({data}) => {
            // console.log('messages', data);
            this.setState({
                privateMessages: data
            })
        }).catch((error) => {
            console.log(error);
        });

    }


    showMessage(object) {

        // alert(object.id);

        axios.post('/messageread', {
            messageId: object.id,
            status: 2
        })
        .then(({data}) => {
            // console.log(data.messages);
            if(data.success) {
                this.setState({
                    privateMessages: data.messages,
                    showWholeMessage: true,
                    subject: object.subject,
                    senderName: object.sender_name,
                    senderEmail: object.sender_email,
                    date: object.timestamp,
                    message: object.private_message
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }


    deleteMessage(object) {

        axios.post('/deletemessage', {
            messageId: object.id
        })
        .then(({data}) => {
            // console.log(data);
            this.setState({
                privateMessages: data
            })
        }).catch((error) => {
            console.log(error);
        });

    }



    render(props) {

        if(!this.state.privateMessages) {
            return null;
        }

        // console.log(this.state.privateMessages);


        const privateMessages = (
            <div id='private-messages-container'>
            {this.state.privateMessages.map((message) => {
                if (message.status == 1) {
                    return
                        <div className='private-message-container-unread' onClick={this.showMessage.bind(this, message)}>
                            <div>
                                <p className='private-message-subject-unread'>{message.subject}</p>
                                <p className='private-message-timestamp-unread'>{new Date(message.timestamp).toLocaleDateString()}</p>
                                <p className='private-message-sender-unread'>{message.sender_name}</p>
                                <p className='delete-message' onClick={this.deleteMessage.bind(this, message)}>Delete</p>
                            </div>
                        </div>
                } else {
                    return
                        <div className='private-message-container' onClick={this.showMessage.bind(this, message)}>
                            <div>
                                <p className='private-message-subject'>{message.subject}</p>
                                <p className='private-message-timestamp'>{new Date(message.timestamp).toLocaleDateString()}</p>
                                <p className='private-message-sender'>{message.sender_name}</p>
                                <p className='delete-message' onClick={this.deleteMessage.bind(this, message)}>Delete</p>
                            </div>
                        </div>
                }
            }
        )}
        </div>
    )

    return (
        <div id='inbox-container'>
            <NavBarLoggedin />
            {privateMessages}
            {this.state.showWholeMessage && <WholeMessage subject={this.state.subject} senderName={this.state.senderName} senderEmail={this.state.senderEmail} date={this.state.date} message={this.state.message} />}
            <div id='clear'></div>
        </div>
    );
}
}



function WholeMessage(props) {
    return (
        <div id='whole-message-container'>
            <p className='whole-message-tag'>Subject:</p>
            <p>{props.subject}</p>
            <p className='whole-message-tag'>From:</p>
            <p>{props.senderName}</p>
            <p>{props.senderEmail}</p>
            <p className='whole-message-tag'>Date:</p>
            <p>{new Date(props.date).toLocaleDateString()}, {new Date(props.date).toLocaleTimeString()}</p>
            <p className='whole-message-message'>{props.message}</p>
        </div>
    );
}
