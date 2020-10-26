import React from 'react';
import io from 'socket.io-client'
import { v4 as uuid } from 'uuid';

class CreateRoom extends React.Component {

    handleCreateRoom = () => {
        let socket = io.connect('http://localhost:8080')
        socket.emit('join-room', uuid(), localStorage.getItem('userId'))
    }


    render() {
        return(
            <button className="primary-btn" onClick={this.handleCreateRoom}>Create</button>
        )
    }
}

export default CreateRoom;
