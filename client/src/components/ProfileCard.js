import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import UserAvatar from './UserAvatar';

const ProfileCard = (props) => {
    const [ status, setStatus ] = React.useState('')
    const handleContextClick = (event) => {
        if (event.type === 'touchstart') {
            event.stopPropagation();
            const x_pos = event.touches[0].pageX.toString() + 'px';
            const y_pos = event.touches[0].pageY.toString() + 'px';
            const online = event.currentTarget.getAttribute('data-online');
            props.handleContextMenu(event.currentTarget.id, 'profile', x_pos, y_pos)
        } else {
            event.preventDefault();
            const x_pos = event.pageX.toString() + 'px';
            const y_pos = event.pageY.toString() + 'px';
            const online = event.currentTarget.getAttribute('data-online');
            props.handleContextMenu(event.currentTarget.id, 'profile', x_pos, y_pos)

        }
    }

    React.useEffect(() => {
        props.socket.on('update-status', (user, game) => {
            if (user === props.userId && game !== null) {
                const message = 'Watching ' + game
                setStatus(message)
            } else if (user === props.userId && game === null) {
                setStatus('')
            }
        }) 
    })


    return(
        <div id={props.userId} className="row sidebar-profile align-items-center" onContextMenu={(event) => handleContextClick(event)} onTouchStart={(event) => handleContextClick(event)} onClick={(event) => event.stopPropagation()}> 
            <div className="col-3">
                <UserAvatar avatar={props.avatar}/>
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{props.username}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6 className="user-status overflow-dots thin">{status}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;
