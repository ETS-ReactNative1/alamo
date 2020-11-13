import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

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
            admins: null
        }
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title, admins: response.data.admins})
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchRoomInformation();
        } 
    }

    componentDidMount() {
        this.fetchRoomInformation();
        setTimeout(() => {
            if (!this.props.rooms.includes(this.props.location.pathname, 0)) {
                console.log('DOES NOT HAVE THIS IN LIST')
                axios.post('/user/add-room', {userId: localStorage.getItem('userId'), roomId: window.location.pathname})
                    .then(response => {
                        this.props.fetchUserInformation()
                    })
            }
        }, 500)
    }

    render() {
        return(
            <div className="room-container d-flex">
                <div className="container-fluid">
                    <h1 className="room-title">{this.state.roomTitle}</h1>
                    <TwitchPlayer/>
                    <RoomRTC admins={this.state.admins}/>
                    <MoreStreams/>
                </div>
                <TwitchChat/>
            </div>
        )
    }
}

export default withRouter(Room);
