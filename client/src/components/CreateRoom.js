import React from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client'
import { v4 as uuid } from 'uuid';
import axios from 'axios';

let socket = io.connect('http://localhost:8080')

class CreateRoom extends React.Component {

    redirect = (path) => {
        this.props.history.push(path);
    }

    handleCreateRoom = (event) => {
        event.preventDefault();
        let unique_id = uuid();
        let roomId = '/room/'+unique_id;
        let userId = localStorage.getItem('userId')
        let roomTitle = event.target[0].value
        let payload = {roomId: roomId, roomTitle: roomTitle, userId: userId}

        axios.post('/create-room', payload)
            .then(reponse => {
                socket.emit('join-room', roomId, userId);
                this.redirect(roomId);
            })

        axios.post('/add-user-to-room', {userId: userId, roomId: roomId})
            .then(response => {
                console.log(response)
            })
    }


    render() {
        return(
            <div>
                <h1 className="setup-heading thin">Create Room</h1>
                <form action="post" onSubmit={this.handleCreateRoom}>
                  <label htmlFor="roomTitle">Room Title</label>
                  <input name="roomTitle" autoFocus required minlength="3" />
                  <button type="submit" className="primary-btn setup-btn block">Create Room</button>
                </form>
            </div>

        )
    }
}

export default withRouter(CreateRoom);
