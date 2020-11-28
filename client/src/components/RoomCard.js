import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import RoomCardUser from './RoomCardUser';

const RoomCard = (props) => {
    const [ room, setRoom ] = React.useState([])
    const [ participants, setParticipants ] = React.useState(0) 
    const [ user, setUser ] = React.useState([])

    const fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: props.roomId}})
            .then(response => {
                setRoom(response.data.room_title)
            })
    }
    const roomParticipants = () => {
        props.socket.emit('room-query', props.roomId, (size) => {
            if (size === 0) {
                setParticipants(size)
                setUser([])
            }
            else {
                setParticipants(size.length)
                setUser(size)
            }
        })    
    }



    React.useEffect(() => {
        fetchRoomInformation();
        roomParticipants();

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


    }, [])

    if (props.activeRoom === props.roomId) {
        return(
            <div className="col room-card" onClick={() => props.history.push(props.roomId)}>
                <div className="row room-card-participants align-items-center">
                    <div className="col">
                        <h1 className="thin">{participants}/6</h1>
                    </div>
                </div>
                <div className="row room-card-users">
                    <div className="col align-items-center">
                        {user.map((user) => {
                            return(
                                <RoomCardUser userId={user}/>
                            )
                        })}
                    </div>
                </div>
                <div className="row room-card-title align-items-center">
                    <div className="col">{room}</div>
                </div>
                <div className="row room-card-button">
                    <div className="col align-items-center">
                        <button className="muted-btn">Join</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <a href={props.roomId} className="col room-card">
                    <div className="row room-card-participants align-items-center">
                        <div className="col">
                            <h1 className="thin">{participants}/6</h1>
                        </div>
                    </div>
                    <div className="row room-card-users">
                        <div className="col align-items-center">
                            {user.map((user) => {
                                return(
                                    <RoomCardUser userId={user}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className="row room-card-title align-items-center">
                        <div className="col">{room}</div>
                    </div>
                    <div className="row room-card-button">
                        <div className="col align-items-center">
                            <button className="muted-btn">Join</button>
                        </div>
                    </div>
            </a>
        )
    }

}

export default withRouter(RoomCard);
