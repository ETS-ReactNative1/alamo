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

let socket = io.connect('http://localhost:8080/')

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

    changeStream = (event) => {
        const channel = event.currentTarget.id
        this.setState({channel: channel})
        axios.post('/room/change-stream', {roomId: window.location.pathname, channel: channel})
            .then((response) => {
                console.log('fire response')
                socket.emit('change-stream', window.location.pathname, channel)
            })
            .catch((err) => console.log(err))
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchRoomInformation();
        } 
    }

    componentDidMount() {
        socket.on('update-stream', (roomId, stream) => {
            if (roomId === window.location.pathname)
                this.setState({channel: stream})
        })

        this.fetchRoomInformation();
    }

    render() {
        return(
            <div className="room-container d-flex">
                <div className="container-fluid">
                    <h1 className="room-title">{this.state.roomTitle}</h1>
                    <TwitchPlayer twitchChannel={this.state.channel}/>
                    <RoomRTC admins={this.state.admins}/>
                    <MoreStreams changeStream={this.changeStream}/>
                </div>
                <TwitchChat twitchChannel={this.state.channel}/>
            </div>
        )
    }
}

export default withRouter(Room);
