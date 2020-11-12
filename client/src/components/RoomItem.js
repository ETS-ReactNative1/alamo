import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomItem = (props) => {
    const [room, setRooms] = React.useState([])

    const redirect = (path) => {
        props.history.push(path);
    }

    const getRoomInformation = () => {
        axios.get('/room', {params: {roomId: props.roomId}})
            .then((response) => {
                setRooms(response.data)
                console.log(response.data)
            })
    }

    React.useEffect(() => {
        getRoomInformation();
    }, [])


    const handleClick = (event) => {
        redirect(event.currentTarget.id)
    }

    const activeChannel = () => {
        if (window.location.pathname === props.roomId) {
            return(
                <i class="fas fa-microphone active-room-icon"></i>
            )
        }
    }

    const room_title = room && room.room_title;

    return(
        <React.Fragment>
            <li id={props.roomId} onClick={(event) => handleClick(event)} className="nav-item">

                {activeChannel()}

                {room_title}

            </li>
        </React.Fragment>
    )
}

export default withRouter(RoomItem);
