import React from 'react';
import { Link } from 'react-router';
import { NavBar } from './profile';
import axios from 'axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

        axios.get('/posts').then(({data}) => {
            console.log(data);
            this.setState({
                posts: data
            })
        }).catch((error) => {
            console.log(error);
        });

    }


    render(props) {

        if(!this.state.posts) {
            return null;
        }

        console.log(this.state.posts);

        const posts = (
            <div id='home-posts-container'>
            {this.state.posts.map((post) =>
                <div className='home-post-container'>
                <img className='home-posts-image' src={post.image ? post.image : '../images/profile.png'} />
                <div className='home-post-text'>
                <p className='home-post-description'>{post.description}</p>
                <p>{post.message}</p>
                </div>
                </div>
            )}
            </div>
        )


        return (
            <div id='home-container'>
            <NavBar />
            <button id="new-org-button">New organisation registration</button>
            {posts}
            </div>
        );
    }
}
