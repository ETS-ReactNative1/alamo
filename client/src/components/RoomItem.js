import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomItem = (props) => {
    const [state, setState] = React.useState([])

    const fetchRoomTitle = async () => {
        const response = await axios.get('/room-info', {params: {roomId: props.roomId}})
        setState(response.data)
        console.log(state)
    }

    const redirect = (path) => {
        props.history.push(path);
    }

    const handleClick = (event) => {
        redirect(event.currentTarget.id)
    }

    const activeChannel = () => {
        if (window.location.pathname === state.roomId) {
            return(
                <i class="fas fa-microphone active-room-icon"></i>
            )
        }
    }

    React.useEffect(() => {
        fetchRoomTitle();
    }, [])

        console.log(props.roomId)
    return(
        <React.Fragment>
            <li id={props.roomId} onClick={(event) => handleClick(event)} className="nav-item">

                {activeChannel()}

                {state.room_title}
            </li>
        </React.Fragment>
    )
}

export default withRouter(RoomItem);
