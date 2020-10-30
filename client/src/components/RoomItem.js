import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomItem = (props) => {
    const [state, setState] = React.useState([])

    const fetchRoomTitle = async () => {
        const response = await axios.get('/room-info', {params: {roomId: props.roomId}})
        setState(response.data[0])
    }

    const redirect = (path) => {
        props.history.push(path);
    }

    const handleClick = (event) => {
        redirect(event.currentTarget.id)
    }

    const activeChannel = () => {
        if (window.location.pathname === state._id) {
            return(
                <i class="fas fa-headphones-alt active-room-icon"></i>
            )
        }
    }

    React.useEffect(() => {
        fetchRoomTitle();
    }, [])

    return(
        <React.Fragment>
            <li id={state._id} onClick={(event) => handleClick(event)} className="nav-item">
                {activeChannel()}
                {state.roomTitle}
            </li>
        </React.Fragment>
    )
}

export default withRouter(RoomItem);
