import React from 'react';

import AddRoomCard from './AddRoomCard';
import RoomCard from './RoomCard';

const RoomShowcase = (props) => {
    return(
        <div className="container-fluid room-showcase-container">
                <div className="row">
                    <div className="col">
                        <h3 className="more-stream-heading thin d-block">Rooms</h3>
                    </div>
                </div>
            <div className="row room-showcase-row" style={{padding: '0 15px 0 15px'}}>
                <AddRoomCard/>
                {props.rooms.map((room) => {
                    return(
                        <RoomCard socket={props.socket} activeRoom={props.activeRoom} roomId={room}/>
                    )
                })}
            </div>
        </div>
    )
};

export default RoomShowcase;
