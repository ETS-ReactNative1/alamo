import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const VoterCard = (props) => {
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
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + avatar + '-avatar.png'} />
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{username}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6 className="user-status thin">Let's watch <span className="bold">{props.stream}?</span></h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoterCard;
