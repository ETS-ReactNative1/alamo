import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import SearchUserCard from './SearchUserCard';
import PendingFriend from './PendingFriend';

const socket = io.connect('https://alamo-d19124355.herokuapp.com/')

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
        this.setState({searchResults: [], pendingInvitations: this.props.pendingInvitations})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.state.pendingInvitations) {
            this.setState({pendingInvitations: nextProps.pendingInvitations});
        }
    }

    handleDecline = (senderId) => {
        let payload = {senderId: senderId, receiverId: localStorage.getItem('userId')}
        axios.post('/user/decline-friend', payload)
            .then(response => {
                this.setState({pendingInvitations: []})
                socket.emit('friend-event', 'decline', senderId, localStorage.getItem('userId'))
            })
            .catch(err => console.log(err))
    }

    handleAddFriend = (receiverId) => {
        let senderId = localStorage.getItem('userId');
        let payload = {senderId: senderId, receiverId: receiverId}

        let socket = io.connect('http://localhost:8080');
        socket.emit('add-friend', senderId, receiverId)

        axios.post('/user/add-friend', payload)
            .then(response => {

                axios.get('/check-friend-status', {params: {searcherId: localStorage.getItem('userId'), recipentId: receiverId}})
                    .then(friendStatus => {
                        this.setState({friendStatus: friendStatus.data.friendStatus})
                        socket.emit('friend-event', 'accept', senderId, localStorage.getItem('userId'))
                    })
            })
            .catch(err => console.log(err))
    }
    
    updatePendingInvitations = (id) => {
        var array = [...this.state.pendingInvitations];
        var index = array.indexOf(id)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({pendingInvitations: array});
        }
    }

    handleAcceptFriend = (recipentId) => {
        let payload = {senderId: localStorage.getItem('userId'), receiverId: recipentId}
        axios.post('/user/accept-friend', payload)
        .then(response => {

                axios.get('/check-friend-status', {params: {searcherId: localStorage.getItem('userId'), recipentId: recipentId}})
                    .then(friendStatus => {
                        this.updatePendingInvitations(recipentId)
                        this.setState({friendStatus: friendStatus.data.friendStatus})

                        //Notify user that friend request was accepted
                        socket.emit('friend-event', 'accept', localStorage.getItem('userId'), recipentId)
                    })

        })
        .catch(err => console.log(err))
    }


    handleUserSearch = (event) => {
        console.log('search user')
        event.preventDefault();
        let username = event.target.username.value;

        if (username != username.toLowerCase()) {
            username = username.toLowerCase();
        }

        axios.get('/user', {params: {username: username}})
            .then(response => {

                console.log(response.data[0]._id)
                //Prevent searching/adding own profile id
                if (response.data[0]._id != localStorage.getItem('userId')) {
                    axios.get('/check-friend-status', {params: {searcherId: localStorage.getItem('userId'), recipentId: response.data[0]._id}})
                        .then(friendStatus => {
                            console.log(friendStatus.data.friendStatus)
                            this.setState({friendStatus: friendStatus.data.friendStatus, searchResults: [response.data[0]], userNotFound: ''})
                        })
                } else {
                    this.setState({searchResults: [], userNotFound: 'Searching yourself aye?'})
                } 

            })
            .catch(err => {
                console.log(err)
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
                        <PendingFriend handleAcceptFriend={this.handleAcceptFriend} userPendingInvitation={user} handleDecline={this.handleDecline} userId={this.props.userId}/>
                    )
                })}

                <label id="friend-control-heading" htmlFor="username">Add Friend</label>
                {this.state.searchResults.map((user) => {
                    return(
                        <SearchUserCard userId={user._id} handleAddFriend={this.handleAddFriend} friendStatus={this.state.friendStatus} username={user.user_metadata.username} status={'Watching Valorant...'} avatar={user.user_metadata.avatar}/>
                    )
                })}
                <h6 id="friend-error-message">{this.state.userNotFound}</h6>
                <form action="post" onSubmit={this.handleUserSearch}>
                    <input id="friend-control-input" placeholder="Username" name="username" autoFocus required/>
                </form>
            </div>
    )}
}

export default AddFriend;
