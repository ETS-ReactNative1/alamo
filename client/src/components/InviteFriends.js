import React from 'react';
import { Redirect } from 'react-router-dom';

import InviteCard from './InviteCard';

const InviteFriends = (props) => {
    const [ invite, setInvite ] = React.useState([])

    const inviteUser = (event) => {
        const friend = event.currentTarget.id
        if (props.createRoom) {
            setInvite(friends => [...friends, friend])
            props.friendsToInvite(friend)
        } else {
            setInvite(friends => [...friends, friend])
            props.socket.emit('room-invite', localStorage.getItem('userId'), friend, props.activeRoom)
        }
    }

    if (typeof props.activeRoom === null || typeof props.friends === 'undefined') {
        return <Redirect to="/"/>
    }
    else {
        return(
            <div className="container-fluid invite-friends-container">
                <div className="row">
                    <div classNamme="col">
                        <h3 class="more-stream-heading thin d-block">Invite Friends</h3>
                    </div>
                </div>
                {props.friends.map((friend) => {
                    if ((friend in props.onlineUsers)) {
                        return(
                            <div className="row justify-content-between align-items-center">
                                <div className="col">
                                    <InviteCard socket={props.socket} key={'invite-'+friend} userId={friend} onlineUsers={props.onlineUsers}/>
                                </div>
                                <div className="col-2">
                                    {(invite.includes(friend, 0)) ? 
                                        <button id={friend} type="button" className="primary-btn small-btn-invite passthrough" style={{paddingLeft: '16px'}}>
                                            Invited
                                            <i className="fas fa-check favourite-icon"></i>
                                        </button>
                                        :
                                        <button id={friend} type="button" className="primary-btn small-btn-invite" onClick={(event) => inviteUser(event)}>
                                            Invite
                                        </button>
                                    }
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }

};

export default InviteFriends;
