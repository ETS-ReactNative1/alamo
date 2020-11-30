import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomContext = (props) => {
    const redirect = (path) => {
        props.history.push(path);
    }

    const handleDeleteRoom = () => {
        const payload = {userId: localStorage.getItem('userId'), roomId: props.id}
        axios.post('/user/remove-room', payload)
            .then((response) => {
                props.fetchUserInformation()
            })
    }

    console.log(props.activeRoom, 'ACTIVE CONTEXT')
    return(
        <div className="container context-menu" style={{display: props.show, top: props.y, left: props.x}}>
            <div className="row">
                <div className="col no-padding">
                    <ul className="nav flex-column font-color">
                        {(props.activeRoom === props.id) ?
                            <a href={'/'} className="context-item">
                                <li>Leave Room</li>
                            </a>
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
