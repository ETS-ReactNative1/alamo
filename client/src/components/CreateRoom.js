import React from 'react';
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import AddStream from './AddStream';
import InviteFriends from './InviteFriends';

const CreateRoom = (props) => {
    const [ friendsInvite, friendsToReceiveInvite ] = React.useState([])
    const [ selected, setSelectedStream] = React.useState('')
    const [ searchBar, showSearchBar] = React.useState(false)

    const redirect = (path) => {
        props.history.push(path);
    }

    const handleCancelRoom = () => {
        props.history.goBack();
    }

    const handleCreateRoom = (event) => {
        event.preventDefault();
        let unique_id = uuid();
        let roomId = '/room/'+unique_id;
        let userId = localStorage.getItem('userId')
        let roomTitle = event.target[0].value
        let payload = {roomId: roomId, roomTitle: roomTitle, userId: userId, streamId: selected}

        axios.post('/room/create-room', payload)
            .then(response => {
                props.socket.emit('join-room', roomId, userId);
            })
            .then(() => {
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
    
    const handleClick = (event) => {
        if (event.currentTarget.id === 'add-stream') {
            showSearchBar(true)
        } else {
            setSelectedStream(event.currentTarget.id)
            if (event.currentTarget.id === selected) {
                setSelectedStream('')
            }
        }
    }

    React.useEffect(() => {
        if (Object.keys(props.createRoomStream).length > 0) {
            setSelectedStream(props.createRoomStream.user_id)
        }
    })

    return(
        <div className="container-fluid px-4 margin-bottom-50">
            <h1 className="setup-heading thin">Create Room</h1>
            <form action="post" onSubmit={handleCreateRoom}>
                <label htmlFor="roomTitle">Room Title</label>
                <input name="roomTitle" autoFocus required minLength="3" maxLength="20"/>
                <label htmlFor="stream">Stream</label>
                <AddStream
                    createRoomStream={props.createRoomStream}
                    handleClick={(event) => handleClick(event)}
                    selected={selected}
                    clearRoomStream={props.clearRoomStream}
                />
                <label htmlFor="roomTitle"></label>
                <InviteFriends 
                    inline={true}
                    friendsToInvite={(friend) => friendsToInvite(friend)}
                    socket={props.socket} 
                    friends={props.friends} 
                    onlineUsers={props.onlineUsers}
                    activeRoom={props.activeRoom}
                    createRoom={true}
                />
                <button type="submit" className="primary-btn setup-btn">Create Room</button>
                <button type="button" className="secondary-btn margin-left setup-btn" onClick={() => handleCancelRoom()}>Cancel</button>
            </form>
        </div>

    )
}

export default withRouter(CreateRoom);
