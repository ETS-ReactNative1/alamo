import React from 'react';
import { Redirect } from 'react-router-dom';

import InviteCard from './InviteCard';

const InviteFriends = (props) => {
    const [ invite, setInvite ] = React.useState('')

    const inviteUser = (event) => {
        const friend = event.currentTarget.id
        props.socket.emit('invite-friend', friend)
        setInvite(friend)
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
                                    {(invite === friend) ? 
                                        <button id={friend} className="primary-btn small-btn-invite passthrough" style={{paddingLeft: '16px'}}>
                                            Invited
                                            <i className="fas fa-check favourite-icon"></i>
                                        </button>
                                        :
                                        <button id={friend} className="primary-btn small-btn-invite" onClick={(event) => inviteUser(event)}>
                                            Invite
                                        </button>
                                    }
                                </div>
                            </div>
                        )
                    }
                })}

                <div className="row">
                    <div classNamme="col">
                        <h3 class="more-stream-heading thin d-block padding-top">Offline</h3>
                    </div>
                </div>
                {props.friends.map((friend) => {
                    if (!(friend in props.onlineUsers)) {
                        return(
                            <div className="row justify-content-between">
                                <div className="col">
                                    <InviteCard socket={props.socket} key={'invite-'+friend} userId={friend} onlineUsers={props.onlineUsers}/>
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
