import React from 'react';
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import AddStreamCard from './AddStreamCard';


const CreateRoom = (props) => {

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
        let payload = {roomId: roomId, roomTitle: roomTitle, userId: userId}

        axios.post('/room/create-room', payload)
            .then(response => {
                console.log(response)
                this.props.socket.emit('join-room', roomId, userId);
                redirect(roomId);
            })

        axios.post('/user/add-room', {userId: userId, roomId: roomId})
            .then(response => {
                console.log(response)
                props.fetchUserInformation()
            })
    }

    return(
        <div>
            <h1 className="setup-heading thin">Create Room</h1>
            <form action="post" onSubmit={handleCreateRoom}>
                <label htmlFor="roomTitle">Room Title</label>
                <input name="roomTitle" autoFocus required minlength="3" />
                <label htmlFor="roomTitle">Stream</label>
                <AddStreamCard/>
                <button type="submit" className="primary-btn setup-btn">Create Room</button>
                <button className="secondary-btn margin-left setup-btn" onClick={handleCancelRoom}>Cancel</button>
            </form>
        </div>

    )
}

export default withRouter(CreateRoom);
