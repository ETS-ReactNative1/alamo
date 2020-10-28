import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import io from 'socket.io-client';

const FriendCard = (props) => {

    const handleAddFriend = (receiverId) => {
        let senderId = localStorage.getItem('userId');
        let payload = {senderId: senderId, receiverId: receiverId}

        let socket = io.connect('http://localhost:8080');
        socket.emit('add-friend', senderId, receiverId)

        axios.post('add-friend', payload)
            .then(response => {
            })
            .catch(err => console.log(err))
    }


    return(
        <div id={props.userId} className="row sidebar-friend align-items-center">
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + props.avatar + '-avatar.png'} />
            </div>
            <div className="col-9">
                <i className={props.add ? "friend-add-icon fas fa-1x fa-plus-square" : null} onClick={() => handleAddFriend(props.userId)}></i>
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{props.username}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6 className="user-status thin">{props.status}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendCard;
