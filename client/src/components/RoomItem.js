import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const RoomItem = (props) => {
    const [room, setRooms] = React.useState([]);
    const [participants, setParticipants] = React.useState(0);
    const componentMounted = React.useRef();

    const redirect = (path) => {
        props.history.push(path);
    }

    const getRoomInformation = () => {
        axios.get('/room', {params: {roomId: props.roomId}})
            .then((response) => {
                setRooms(response.data)
            })
    }
    
    const roomParticipants = () => {
        props.socket.emit('room-size-query', props.roomId, (size) => {
            if (Object.keys(size).length > 0) {
                console.log(Object.keys(size).length, "ROOM SDIZE", props.roomId)
                setParticipants(Object.keys(size).length)
                console.log(participants, 'PARTICIPANTS')
            }
        })
    }

    React.useEffect(() => {
        console.log('room item')
        roomParticipants();
        getRoomInformation();
        //Listen for when any user joins or leaves a room that belongs to the client
        props.socket.on('user-joined-room', (roomId, size) => {
            if (roomId === props.roomId)
                setParticipants(Object.keys(size).length)
        })

        props.socket.on('user-left-room', (roomId, size) => {
            if (roomId === props.roomId)
                setParticipants(Object.keys(size).length)
        })

        props.socket.on('user-disconnected', () => {
            roomParticipants();
        })        
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
                    <span className="room-item-size">{participants}/6</span>
                </li>
            )
        } else {
            return(
                <a href={props.roomId} className={participants === 6 ? "nav-item passthrough" : "nav-item"}>
                    <li onContextMenu={handleContextClick} id={props.roomId}>
                        {room_title}
                        <span className="room-item-size">{participants}/6</span>
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
