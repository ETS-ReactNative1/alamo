import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PendingFriend = (props) => {

    const { user } = useAuth0();

    return(
        <div id={props.userId} className="row sidebar-friend align-items-center">
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + props.avatar + '-avatar.png'} alt={user.name} />
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{props.username}</h3>
                    </div>
                </div>
                <div className="row invitation-btns">
                    <div className="col-2 decline">
                        <i className="fas fa-2x fa-times"></i>
                    </div>
                    <div className="col-2 accept">
                        <i className="fas fa-2x fa-check"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PendingFriend;
