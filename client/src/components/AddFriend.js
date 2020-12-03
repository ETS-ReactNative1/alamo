import React from 'react';
import axios from 'axios';

import SearchUserCard from './SearchUserCard';
import PendingFriend from './PendingFriend';

import FriendStatus from '../helpers/FriendStatus';

class AddFriend extends React.Component {
    constructor(props) {
        super(props)

        this.clientId = localStorage.getItem('userId');
        this.state = { 
            searchResults: [],
            userNotFound: '',
            pendingInvitations: []
        }
    }

    componentDidMount() {
        this.setState({searchResults: [], pendingInvitations: this.props.pendingInvitations})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.state.pendingInvitations) {
            this.setState({pendingInvitations: nextProps.pendingInvitations});
        }
    }

    handleDecline = (senderId) => {
        let payload = {senderId: senderId, receiverId: this.clientId}
        axios.post('/user/decline-friend', payload)
            .then(response => {
                this.setState({pendingInvitations: []})
                this.props.socket.emit('friend-event', 'decline', this.clientId, senderId)
            })
            .catch(err => console.log(err))
    }

    handleAcceptFriend = (recipentId) => {
        let payload = {senderId: this.clientId, receiverId: recipentId}
        axios.post('/user/accept-friend', payload)
        .then(response => {
            FriendStatus(this.clientId, recipentId)
            .then((status) => {
                this.setState({friendStatus: status})
                this.updatePendingInvitations(recipentId)
                this.props.fetchUserInformation();
                //Notify user that friend request was accepted
                this.props.socket.emit('friend-event', 'accept', this.clientId, recipentId)
            })
        })
        .catch(err => console.log(err))
    }

    handleAddFriend = (recipentId) => {
        let senderId = this.clientId;
        let payload = {senderId: senderId, receiverId: recipentId}

        this.props.socket.emit('add-friend', senderId, recipentId)

        axios.post('/user/add-friend', payload)
            .then(response => {
                FriendStatus(this.clientId, recipentId)
                    .then((status) => {
                        this.setState({friendStatus: status})
                        this.props.socket.emit('friend-event', 'invite', senderId, recipentId)
                    })
            })
            .catch(err => console.log(err))
    }
    
    updatePendingInvitations = (id) => {
        const array = [...this.state.pendingInvitations];
        const index = array.indexOf(id)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({pendingInvitations: array});
        }
    }

   handleUserSearch = (event) => {
        event.preventDefault();
        let username = event.target.username.value;
        if (username != username.toLowerCase()) username = username.toLowerCase();

        axios.get('/user', {params: {username: username}})
            .then(response => {
                const user = response.data[0];
                //Prevent searching/adding own profile id
                if (user._id != this.clientId) {
                    FriendStatus(this.clientId, user._id)
                        .then((status) => this.setState({friendStatus: status, searchResults: [user]}))
                } else {
                    this.setState({searchResults: [], userNotFound: 'Searching yourself aye?'})
                } 
            })
            .catch(err => {
                this.setState({searchResults: [], userNotFound: 'No Users Found.'})
            });
    }

    handleClick = () => {
        console.log('clicked')
    }

    render() {
        return (
            <div className={(this.props.addFriendActive) ? "col-12 friends-input-controls add-friends-active" : "col-12 friends-input-controls"} onClick={(event) => event.stopPropagation()} >

                {this.state.pendingInvitations.length > 0 ? <label id="friend-control-heading" htmlFor="username">Pending Invitations</label> : null}

                {this.state.pendingInvitations.map((user) => {
                    return(
                        <PendingFriend 
                            key={user} 
                            handleAcceptFriend={this.handleAcceptFriend} 
                            userPendingInvitation={user} 
                            handleDecline={this.handleDecline} 
                            userId={this.props.userId}
                        />
                    )
                })}

                <label id="friend-control-heading" htmlFor="username">Add Friend</label>
                {this.state.searchResults.map((user) => {
                    return(
                        <SearchUserCard 
                            userId={user._id} 
                            key={user} 
                            handleAddFriend={this.handleAddFriend} 
                            friendStatus={this.state.friendStatus} 
                            username={user.user_metadata.username} 
                            status={'Watching Valorant...'} 
                            avatar={user.user_metadata.avatar}
                        />
                    )
                })}
                <h6 id="friend-error-message">{this.state.userNotFound}</h6>
                <form action="post" onSubmit={this.handleUserSearch} onClick={this.handleClick}>
                    <input 
                        id="friend-control-input" 
                        placeholder="Username" 
                        name="username" 
                        autoFocus 
                        required
                    />
                </form>
            </div>
    )}
}

export default AddFriend;
