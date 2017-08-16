import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

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
            url: ''
        };

        this.closeMoreInfo = this.closeMoreInfo.bind(this);

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


    getComponent(object) {

        // alert(object.id);
        this.setState({
            showMoreVisible: true,
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

        alert(object.id);
        // this.setState({
        //     showMoreVisible: true,
        //     imageUrl: object.image,
        //     name: object.name,
        //     description: object.description,
        //     message: object.message,
        //     about: object.about,
        //     address: object.address,
        //     url: object.url
        // })
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
                <img className='home-posts-image' src={post.image ? post.image : '../images/profile.png'} alt={post.name} />
                <div className='home-post-text'>
                <p className='home-post-description'>{post.description}</p>
                <p>{post.message}</p>
                <p onClick={this.getComponent.bind(this, post)}>More</p>
                <p onClick={this.startContact.bind(this, post)}>Contact</p>
                </div>
                </div>
            )}
            </div>
        )


        return (
            <div id='home-container'>
            <NavBar />
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
            <Link to='/register'><button id="new-org-button">Organisation registration</button></Link>
            {posts}
            </div>
        );
    }
}


function MoreInfo(props) {
    return (
        <div id='more-info-container'>
        <img id='more-info-image' src={props.imageUrl} alt={props.name} />
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



function NavBar() {
    return (
        <div id='nav-header-container'>
        <img id='logo' src='../images/logo.png' />
        <p id='nav-heading'>Bliiblaa</p>
        </div>
    );
}





//
//     TÄMÄ TOIMII
//
//
// import React from 'react';
// import { Link } from 'react-router';
// import axios from 'axios';
//
// export default class Home extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             imageUrl: '',
//             name: '',
//             description: '',
//             message: '',
//             about: '',
//             address: '',
//             url: ''
//         };
//
//         this.closeMoreInfo = this.closeMoreInfo.bind(this);
//
//     }
//
//     componentDidMount() {
//
//         axios.get('/posts').then(({data}) => {
//             console.log(data);
//             this.setState({
//                 posts: data
//             })
//         }).catch((error) => {
//             console.log(error);
//         });
//
//     }
//
//     closeMoreInfo() {
//         this.setState({
//             showMoreVisible: false,
//             imageUrl: '',
//             name: '',
//             description: '',
//             about: '',
//             address: '',
//             url: ''
//         })
//     }
//
//
//     componentDidUpdate() {
//         window.scrollTo(0,0);
//     }
//
//     getComponent(object) {
//
//         // alert(object.id);
//         this.setState({
//             showMoreVisible: true,
//             imageUrl: object.image,
//             name: object.name,
//             description: object.description,
//             message: object.message,
//             about: object.about,
//             address: object.address,
//             url: object.url
//         })
//     }
//
//
//     render(props) {
//
//         if(!this.state.posts) {
//             return null;
//         }
//
//         console.log(this.state.posts);
//
//         const posts = (
//             <div id='home-posts-container'>
//             {this.state.posts.map((post) =>
//                 <div className='home-post-container' onClick={this.getComponent.bind(this, post)}>
//                 <img className='home-posts-image' src={post.image ? post.image : '../images/profile.png'} alt={post.name} />
//                 <div className='home-post-text'>
//                 <p className='home-post-description'>{post.description}</p>
//                 <p>{post.message}</p>
//                 </div>
//                 </div>
//             )}
//             </div>
//         )
//
//
//         return (
//             <div id='home-container'>
//             <NavBar />
//             <div id='home-about-container'>
//             <div id='home-berliner-container'>
//             <h2>Berliner</h2>
//             <div id='home-berliner-text'>
//             <p>You would like to help but don´t know what kind of donations are needed and where?</p>
//             <p id='home-berliner-bold'>Have a look at the posts below</p>
//             </div>
//             </div>
//             <div id='home-organisation-container'>
//             <div id='home-organisation-text'>
//             <h2>Organisation</h2>
//             <p>Your organisation would need specific donations?</p>
//             <p id='home-organisation-bold'>Register and make a post</p>
//             </div>
//             </div>
//             </div>
//             {this.state.showMoreVisible && <MoreInfo imageUrl={this.state.imageUrl} name={this.state.name} description={this.state.description} closeMoreInfo={this.closeMoreInfo} message={this.state.message} about={this.state.about} address={this.state.address} url={this.state.url} />}
//             <Link to='/register'><button id="new-org-button">Organisation registration</button></Link>
//             {posts}
//             </div>
//         );
//     }
// }
//
//
// function MoreInfo(props) {
//     return (
//         <div id='more-info-container'>
//         <img id='more-info-image' src={props.imageUrl} alt={props.name} />
//         <div id='more-text'>
//         <p id='more-info-description'>{props.description}</p>
//         <p id='more-info-message'>{props.message}</p>
//         {props.about && <p className='profile-tag'>About us:</p>}
//         {props.about && <p>{props.about}</p>}
//         {props.address && <p className='profile-tag'>Address:</p>}
//         {props.address && <p>{props.address}</p>}
//         {props.url && <p className='profile-tag'>Website:</p>}
//         {props.url && <p>{props.url}</p>}
//         <p id="hide-more-info" onClick={props.closeMoreInfo}>Close</p>
//         </div>
//         </div>
//     );
// }
//
//
//
// function NavBar() {
//     return (
//         <div id='nav-header-container'>
//         <img id='logo' src='../images/logo.png' />
//         <p id='nav-heading'>Bliiblaa</p>
//         </div>
//     );
// }
//
//
//
// //
// // const posts = (
// //     <div id='home-posts-container'>
// //     {this.state.posts.map((post) =>
// //         <div className='home-post-container'>
// //         <img className='home-posts-image' src={post.image ? post.image : '../images/profile.png'} ref={elem => this.elem = elem} onClick={this.showMore} />
// //         <div className='home-post-text'>
// //         <p className='home-post-description'>{post.description}</p>
// //         <p>{post.message}</p>
// //         </div>
// //         </div>
// //     )}
// //     </div>
// // )
