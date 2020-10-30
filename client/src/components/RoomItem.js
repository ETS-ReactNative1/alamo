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

    React.useEffect(() => {
        fetchRoomTitle();
    }, [])

    return(
        <li id={state._id} onClick={(event) => handleClick(event)} className="nav-item">{state.roomTitle}</li>
    )
}

export default withRouter(RoomItem);
