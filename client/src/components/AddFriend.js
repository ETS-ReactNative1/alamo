import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import FriendCard from './FriendCard';
import PendingFriend from './PendingFriend';

class AddFriend extends React.Component {
    constructor(props) {
        super(props)

        this.state = { 
            searchResults: [],
            userNotFound: '',
            pendingInvitations: []
        }
    }

    componentDidMount() {
        this.setState({pendingInvitations: this.props.pendingInvitations})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.state.pendingInvitations) {
            this.setState({pendingInvitations: nextProps.pendingInvitations});
        }
    }

    handleDecline = (senderId) => {
        const socket = io.connect('http://localhost:8080')
        let payload = {senderId: senderId, receiverId: localStorage.getItem('userId')}
        axios.post('/decline-friend-invite', payload)
            .then(response => {
                this.setState({pendingInvitations: []})
                socket.emit('friend-event', 'decline', senderId, localStorage.getItem('userId'))
            })
            .catch(err => console.log(err))
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
        console.log(this.props.pendingInvitations)
        return (
            <div className={(this.props.addFriendActive) ? "col-12 friends-input-controls add-friends-active" : "col-12 friends-input-controls"} >

                {this.state.pendingInvitations.length > 0 ? <label id="friend-control-heading" htmlFor="username">Pending Invitations</label> : null}

                {this.state.pendingInvitations.map((user) => {
                    return(
                        <PendingFriend userPendingInvitation={user} handleDecline={this.handleDecline} userId={this.props.userId}/>
                    )
                })}

                <label id="friend-control-heading" htmlFor="username">Add Friend</label>
                {this.state.searchResults.map((user) => {
                    return(
                        <FriendCard userId={user._id} add={true} username={user.user_metadata.username} status={'Watching Valorant...'} avatar={user.user_metadata.avatar}/>
                    )
                })}
                <h6 id="friend-error-message">{this.state.userNotFound}</h6>
                <form action="post" onSubmit={this.handleUserSearch}>
                    <input id="friend-control-input" placeholder="Username" name="username" autoFocus required minlength="3" />
                </form>
            </div>
    )}
}

export default AddFriend;
