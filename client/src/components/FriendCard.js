import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import io from 'socket.io-client';


const FriendCard = (props) => {
    const [state, setState] = React.useState([])
    const socket = io.connect('http://localhost:8080')

    const fetchUserInformation = async () => {
        const response = await axios.get('/user', {params: {userId: props.userId}})
        setState([response.data[0]])
    }

    React.useEffect(() => {
        fetchUserInformation();
    }, [])


    const username = state[0] && state[0].username && state[0].user_metadata.username;
    const avatar = state[0] && state[0].user_metadata && state[0].user_metadata.avatar;
    const online = state[0] && state[0].online

    return(
        <div id={props.userId} className="row sidebar-friend align-items-center">
            <div className="col-3">
                {online ? <i class="fas fa-circle online"></i> : null }
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
                        <h6 className="user-status thin">Watching Valorant...</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendCard;
