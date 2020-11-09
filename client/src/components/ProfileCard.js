import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ProfileCard = (props) => {
    const handleContextClick = (event) => {
        event.preventDefault();
        const x_pos = event.pageX.toString() + 'px';
        const y_pos = event.pageY.toString() + 'px';
        props.handleContextMenu(props.userId, x_pos, y_pos)
    }

    return(
        <div id={props.userId} className="row sidebar-profile align-items-center" onContextMenu={handleContextClick}>
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + props.avatar + '-avatar.png'} />
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

export default ProfileCard;
