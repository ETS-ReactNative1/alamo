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
            })
    }

    React.useEffect(() => {
        getRoomInformation();
    }, [props.roomId])

    const handleContextClick = (event) => {
        event.preventDefault();
        const x_pos = event.pageX.toString() + 'px';
        const y_pos = event.pageY.toString() + 'px';
        props.handleContextMenu(event.currentTarget.id, 'room', x_pos, y_pos)
    }

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
            <li onContextMenu={handleContextClick} id={props.roomId} onClick={(event) => handleClick(event)} className="nav-item">

                {activeChannel()}

                {room_title}

            </li>
        </React.Fragment>
    )
}

export default withRouter(RoomItem);
