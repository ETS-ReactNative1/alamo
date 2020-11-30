import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const FriendContext = (props) => {
    const redirect = (path) => {
        props.history.push(path);
    }

    const handleDeleteRoom = () => {
        const payload = {userId: localStorage.getItem('userId'), friendId: props.id}
        axios.post('/user/unfriend', payload)
            .then((response) => {
                props.fetchUserInformation()
            })
    }

    const inviteFriend = (friend) => {
        props.socket.emit('room-invite', localStorage.getItem('userId'), friend, props.activeRoom)
    }

    return(
        <div className="container context-menu" style={{display: props.show, top: props.y, left: props.x}}>
            <div className="row">
                <div className="col no-padding">
                    <ul className="nav flex-column font-color">
                        <li className={(props.online === 'true' && props.activeRoom != null) ? "context-item" : "context-item disabled"} onClick={() => inviteFriend(props.id)}>Invite to room</li>
                        <li className="context-item" onClick={() => handleDeleteRoom()}>Unfriend</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withRouter(FriendContext);
