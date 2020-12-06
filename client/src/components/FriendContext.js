import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const FriendContext = (props) => {
    const redirect = (path) => {
        props.history.push(path);
        props.closeContextMenu();
    }

    const handleDeleteRoom = () => {
        const payload = {userId: localStorage.getItem('userId'), friendId: props.id}
        axios.post('/user/unfriend', payload)
            .then((response) => {
                props.fetchUserInformation()
            })
        props.closeContextMenu();
    }

    const inviteFriend = (event, friend) => {
        event.stopPropagation();
        props.socket.emit('room-invite', localStorage.getItem('userId'), friend, props.activeRoom)
        props.closeContextMenu();
    }

    return(
        <div className="container context-menu" style={{display: props.show, top: props.y, left: props.x}} onClick={(event) => event.stopPropagation()}>
            <div className="row">
                <div className="col no-padding">
                    <ul className="nav flex-column font-color">
                        <li className={(props.online === 'true' && props.activeRoom != null) ? "context-item" : "context-item disabled"} onClick={(event) => inviteFriend(event, props.id)}>Invite to room</li>
                        <li className="context-item" onClick={() => handleDeleteRoom()}>Unfriend</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withRouter(FriendContext);
