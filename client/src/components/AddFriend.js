import React from 'react';
import axios from 'axios';

import FriendCard from './FriendCard';
import PendingFriend from './PendingFriend';

class AddFriend extends React.Component {
    constructor(props) {
        super(props)

        this.state = { 
            searchResults: [],
            userNotFound: ''
        }
    }

    handleUserSearch = (event) => {
        event.preventDefault();

        axios.get('/search-user', {params: {username: event.target.username.value}})
            .then(response => {
                console.log(response)
                this.setState({searchResults: [response.data], userNotFound: ''})
            })
            .catch(err => {
                this.setState({searchResults: [], userNotFound: 'No Users Found.'})
            })
    }

    render() {
        return (
            <div className={(this.props.addFriendActive) ? "col-12 friends-input-controls add-friends-active" : "col-12 friends-input-controls"} >
                <label id="friend-control-heading" htmlFor="username">Pending Invitations</label>
                <PendingFriend userId={'13983290323'} username={'snakesgorman'} avatar={'chaplin'}/>
                <label id="friend-control-heading" htmlFor="username">Add Friend</label>
                {this.state.searchResults.map((user) => {
                    console.log(user._id, 'MAP')
                    return(
                        <FriendCard userId={user._id} add={true} username={user.user_metadata.username} status={'Watching Valorant...'} avatar={user.user_metadata.avatar}/>
                    )
                })}
                <h6 id="friend-error-message">{this.state.userNotFound}</h6>
                <form action="post" onSubmit={this.handleUserSearch}>
                    <input id="friend-control-input" placeholder="Username" name="username" autoFocus required minlength="3" />
                </form>
            </div>
        )
    }
}

export default AddFriend;
