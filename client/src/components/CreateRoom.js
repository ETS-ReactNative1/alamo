import React from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client'
import { v4 as uuid } from 'uuid';

let socket = io.connect('http://localhost:8080')

console.log(socket)
class CreateRoom extends React.Component {

    redirect = (path) => {
        this.props.history.push(path);
    }

    handleCreateRoom = () => {
        let unique_id = uuid();
        let roomId = '/room/'+unique_id;
        socket.emit('join-room', roomId, localStorage.getItem('userId'));
        this.redirect(roomId);
    }


    render() {
        return(
            <button className="primary-btn" onClick={this.handleCreateRoom}>Create</button>
        )
    }
}

export default withRouter(CreateRoom);
