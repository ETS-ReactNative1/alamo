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

<<<<<<< HEAD
=======
let socket = io.connect('https://alamo-d19124355.herokuapp.com/')
>>>>>>> update socket.io connect to heroku urls

class Room extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            roomTitle: null,
            admins: null,
            channel: null
        }
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title, admins: response.data.admins, channel: response.data.stream_channel})
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
                    <TwitchPlayer twitchChannel={this.state.channel}/>
                    <RoomRTC admins={this.state.admins}/>
                    <MoreStreams/>
                </div>
                <TwitchChat twitchChannel={this.state.channel}/>
            </div>
        )
    }
}

export default withRouter(Room);
