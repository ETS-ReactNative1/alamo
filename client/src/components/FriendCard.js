import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import io from 'socket.io-client';

const FriendCard = (props) => {
    const [state, setState] = React.useState([])
    const socket = io.connect('http://localhost:8080')

    const fetchUserInformation = async () => {
        const response = await axios.get('/userId', {params: {userId: props.userId}})
        setState(response.data[0])
    }

    React.useEffect(() => {

        socket.on('new-user-online', (userId) => {
            if (userId === props.userId) {
                const online = true;
                setState(oldState => [...oldState, online])
            }
        })
        fetchUserInformation();
    }, [])

    const username = state && state.username && state.user_metadata.username;
    const avatar = state && state.user_metadata && state.user_metadata.avatar;
    const online = state && state.online
    console.log(state)

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
