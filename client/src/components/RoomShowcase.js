import React from 'react';
import AddRoomCard from './AddRoomCard';

const RoomShowcase = () => {
    return(
        <div className="container-fluid more-streams-container">
                <div className="row">
                    <div className="col">
                        <h3 className="more-stream-heading thin d-block">Rooms</h3>
                    </div>
                </div>

                <AddRoomCard/>
        </div>
    )
};

export default RoomShowcase;
