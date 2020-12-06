import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomContext = (props) => {
    const redirect = (path) => {
        props.history.push(path);
        props.closeContextMenu();
    }

    const handleDeleteRoom = () => {
        const payload = {data : {userId: localStorage.getItem('userId'), roomId: props.id}}
        axios.delete('/user/room', payload)
            .then((response) => {
                props.fetchUserInformation()
            })
        props.closeContextMenu();
    }

    const handleLeave = () => {
        props.socket.emit('now-watching', localStorage.getItem('userId'), null, () => {
            window.location.assign('/');
        })
        props.closeContextMenu();
    }

    return(
        <div className="container context-menu" style={{display: props.show, top: props.y, left: props.x}} onClick={(event) => event.stopPropagation()}>
            <div className="row">
                <div className="col no-padding">
                    <ul className="nav flex-column font-color">
                        {(props.activeRoom === props.id) ?
                            <li className="context-item" onClick={() => handleLeave()}>Leave Room</li>
                            :
                            <a href={props.id} className="context-item">
                                <li>Join Room</li>
                            </a>
                        }
                        <li className="context-item" onClick={() => handleDeleteRoom()}>Delete Room</li>
                        <li className="context-item" onClick={() => redirect(`/edit${props.id}`)}>Edit Room</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withRouter(RoomContext);
