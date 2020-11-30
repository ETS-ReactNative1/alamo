import React from 'react';
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import InviteFriends from './InviteFriends';
import AddStreamCard from './AddStreamCard';


const CreateRoom = (props) => {
    const [ friendsInvite, friendsToReceiveInvite ] = React.useState([])

    const redirect = (path) => {
        props.history.push(path);
    }

    const handleCancelRoom = () => {
        props.history.goBack();
    }

    const handleCreateRoom = (event) => {
        console.log("CREATE ROOM")
        event.preventDefault();
        let unique_id = uuid();
        let roomId = '/room/'+unique_id;
        let userId = localStorage.getItem('userId')
        let roomTitle = event.target[0].value
        let payload = {roomId: roomId, roomTitle: roomTitle, userId: userId}

        axios.post('/room/create-room', payload)
            .then(response => {
                props.socket.emit('join-room', roomId, userId);
                InviteFriendsPromise(roomId)
                    .then(() => {
                        redirect(roomId);
                        window.location.reload();
                    })
            })

        axios.post('/user/add-room', {userId: userId, roomId: roomId})
            .then(response => {
                props.fetchUserInformation()
            })
    }

    const friendsToInvite = (friend) => {
        friendsToReceiveInvite(friends => [...friends, friend])
    }

    const InviteFriendsPromise = async (roomId) => {
        const invite = new Promise((resolve, reject) => {
            friendsInvite.forEach((friend) => {
                props.socket.emit('room-invite', localStorage.getItem('userId'), friend, roomId)
            })
            resolve();
        })
        return invite
    }

    return(
        <div>
            <h1 className="setup-heading thin">Create Room</h1>
            <form action="post" onSubmit={handleCreateRoom}>
                <label htmlFor="roomTitle">Room Title</label>
                <input name="roomTitle" autoFocus required minlength="3" />
                <label htmlFor="roomTitle">Stream</label>
                <AddStreamCard/>
                <label htmlFor="roomTitle"></label>
                <InviteFriends 
                    createRoom={true}
                    friendsToInvite={(friend) => friendsToInvite(friend)}
                    socket={props.socket} 
                    friends={props.friends} 
                    onlineUsers={props.onlineUsers}
                    activeRoom={props.activeRoom}
                />
                <button type="submit" className="primary-btn setup-btn">Create Room</button>
                <button className="secondary-btn margin-left setup-btn" onClick={() => handleCancelRoom}>Cancel</button>
            </form>
        </div>

    )
}

export default withRouter(CreateRoom);
