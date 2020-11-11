import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';

import RoomUser from './RoomUser';
import RoomRTC from './RoomRTC';
import TwitchPlayer from './TwitchPlayer';
import TwitchChat from './TwitchChat';
import TwitchLogin from './TwitchLogin';
import MoreStreams from './MoreStreams';


class Room extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            roomTitle: null,
        }
    }

    fetchRoomInformation = () => {
        axios.get('/room-info', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title})
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchRoomInformation();
        }
    }

    componentDidMount() {
        this.fetchRoomInformation();
    }

    render() {
        return(
            <div className="room-container d-flex">
                <div className="container-fluid">
                    <h1 className="room-title">{this.state.roomTitle}</h1>
                    <TwitchPlayer/>
                    <RoomRTC/>
                    <MoreStreams/>
                </div>
                <TwitchChat/>
            </div>
        )
    }
}

export default Room;
