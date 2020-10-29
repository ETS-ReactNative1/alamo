import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import io from 'socket.io-client';

class SearchUserCard extends React.Component  {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div id={this.props.userId} className="row sidebar-friend align-items-center">
                <div className="col-3">
                    <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + this.props.avatar + '-avatar.png'} />
                </div>
                <div className="col-9">
                    <i className={(this.props.friendStatus === true) ? "friend-add-icon fas fa-1x fa-check-circle" : null}></i>

                    <i className={(this.props.friendStatus === false) ? "friend-add-icon fas fa-1x fa-plus-square" : null} onClick={() => this.props.handleAddFriend(this.props.userId)}></i>

                    <i className={(this.props.friendStatus === 'pending') ? "friend-add-icon fas fa-1x fa-user-clock" : null}></i>

                    <div className="row">
                        <div className="col">
                            <h3 className="username bold">{this.props.username}</h3>
                        </div>
                    </div>
                    {(this.props.friendStatus === 'toBeAccepted') ? (
                        <div className="row invitation-btns">
                            <div className="col-2 decline" onClick={() => this.props.handleDecline(this.props.userPendingInvitation)}>
                                <i className="fas fa-2x fa-times"></i>
                            </div>
                            <div className="col-2 accept">
                                <i className="fas fa-2x fa-check"></i>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default SearchUserCard;
