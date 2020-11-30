import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

import UserAvatar from './UserAvatar';

const InviterCard = (props) => {
    const [voter, setVoter] = React.useState([])

    React.useEffect(() => {
        axios.get('/user', {params: {userId: props.userId}})
            .then((response) => {
                console.log(response.data[0])
                setVoter(response.data[0])
            })
    }, [])

    const avatar = voter && voter.user_metadata && voter.user_metadata.avatar;
    const username = voter && voter.user_metadata && voter.user_metadata.username;
    console.log(props.userId)
    return(
        <div id={props.userId} className="row sidebar-profile align-items-center">
            <div className="col-3">
                <UserAvatar avatar={avatar}/>
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{username}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6 className="user-status thin">Hey, <span className="bold">{props.invitee}</span>, we're watching <span className="bold">{props.stream}.</span> Come join us?</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InviterCard;
