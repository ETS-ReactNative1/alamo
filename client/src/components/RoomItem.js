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
        props.showRoom();
    }

    const room_title = room && room.room_title;
    const activeChannel = () => {
        if (props.activeRoom === props.roomId) {
            return(
                <li onContextMenu={handleContextClick} id={props.roomId} className="nav-item" onClick={(event) => handleClick(event)}>
                    {(props.activeRoom === props.roomId) ? <i className="fas fa-microphone active-room-icon"></i> : null}
                    {room_title}
                </li>
            )
        } else {
            return(
                <a href={props.roomId} className="nav-item">
                    <li onContextMenu={handleContextClick} id={props.roomId}>
                        {room_title}
                    </li>
                </a>
            )

        }
    }


    return(
        <React.Fragment>
            {activeChannel()}
        </React.Fragment>
    )
}

export default withRouter(RoomItem);
