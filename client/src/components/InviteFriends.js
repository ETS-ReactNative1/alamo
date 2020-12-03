import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

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
            <div className="container-fluid invite-friends-container" style={props.inline ? {padding: '0'} : {padding: '35px'}}>
                <div className="row">
                    <div className="room-headings">
                        {!props.inline ? 
                            <i className="fas back-arrow font-color fa-2x fa-arrow-left" onClick={() => props.history.goBack()}></i>
                        : null }
                            <h1 className="room-title">Invite Friends</h1>
                      </div>
                </div>
                {props.friends.map((friend) => {
                    if ((friend in props.onlineUsers)) {
                        return(
                            <div className="row align-items-center">
                                <div className="col">
                                    <InviteCard socket={props.socket} key={'invite-'+friend} userId={friend} onlineUsers={props.onlineUsers}/>
                                </div>
                                <div className="col-2" style={{right: '60px'}}>
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

export default withRouter(InviteFriends);
