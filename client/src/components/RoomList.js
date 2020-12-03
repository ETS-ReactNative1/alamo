import React from 'react';
import RoomItem from './RoomItem';
import { withRouter } from 'react-router-dom';

const RoomList = (props) => {
    const redirect = (path) => {
        props.history.push('/create-room');
    }

    const initRooms = () => {
        if (props.rooms.length === 0) {
            return(
                <li className="nav-item" onClick={() => redirect('/create-room')}>Create a Room</li>
            )
        }
    }
    return(
        <ul className="nav flex-column room-column">
            <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Rooms</h3>
            <button className="primary-btn sidebar-create-button" onClick={() => props.history.push('/create-room')}>Create</button>

            {initRooms()}

            {props.rooms.map((roomId, index) => {
                return(
                    <RoomItem socket={props.socket} activeRoom={props.activeRoom} showRoom={props.showRoom} changeRoom={props.changeRoom} key={index} roomId={roomId} handleContextMenu={props.handleContextMenu}/>
                )
            })}
        </ul>
    )
}

export default withRouter(RoomList);
