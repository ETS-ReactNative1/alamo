import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const FriendCard = (props) => {

    const { user } = useAuth0();

    return(
        <div className="row sidebar-friend align-items-center">
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + props.avatar} alt={user.name} />
            </div>
            <div className="col-9">
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
