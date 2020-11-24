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
import Vote from './Vote';

let socket = io.connect('http://localhost:8080/')

class Room extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            roomTitle: '',
            admins: '',
            channel: '',
            vote: false,
            voterId: '',
            voterChannel: ''
        }
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title, admins: response.data.admins, channel: response.data.stream_channel})
            })
    }

    changeStream = (event) => {
        console.log(event)
        const channel = event.currentTarget.id
        this.setState({channel: channel})
        axios.post('/room/change-stream', {roomId: window.location.pathname, channel: channel})
            .then((response) => {
                console.log('fire response')
                socket.emit('change-stream', window.location.pathname, channel)
            })
            .catch((err) => console.log(err))
    }

    vote = (event) => {
        const channel = event.currentTarget.id
        const thumbnail = event.currentTarget.getAttribute('data-image')
        const avatar = event.currentTarget.getAttribute('data-channelImage')
        const title = event.currentTarget.getAttribute('data-streamTitle')

        const stream = {channel: channel, thumbnail: thumbnail, avatar: avatar, title: title}

        socket.emit('start-vote', window.location.pathname, localStorage.getItem('userId'), stream)
    }

    voteYes = () => {
        return socket.emit('vote-yes', this.state.voterId)
    }

    voteNo = () => {
        return socket.emit('vote-no', this.state.voterId)
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

        socket.on('vote', (roomId, userId, stream) => {
            console.log('VOTE RECEIVED', userId, 'would like to vote')
            if (roomId === window.location.pathname) {
                this.setState({vote: true, voterId: userId, voterChannel: stream})
                
                setTimeout(() => {
                    this.setState({vote: false})
                }, 1000 * 30)
            }
        });

        socket.on('end-vote', (roomId) => {
            if (roomId === window.location.pathname)
                this.setState({vote: false})
        })

        socket.on('inc-vote-yes', (voterId) => {
            if (voterId === localStorage.getItem('userId'))
                this.setState({channel: this.state.voterChannel.channel, vote: false})
                socket.emit('change-stream', window.location.pathname, this.state.voterChannel.channel)
                socket.emit('close-vote', window.location.pathname)
        })

        this.fetchRoomInformation();
    }

    render() {
        return(
            <React.Fragment>
                {this.state.vote ? <Vote userId={this.state.voterId} voteYes={this.voteYes} voteNo={this.voteNo} stream={this.state.voterChannel}/> : null}
                <div className="room-container d-flex">
                    <div className="container-fluid">
                        <h1 className="room-title">{this.state.roomTitle}</h1>
                        <TwitchPlayer twitchChannel={this.state.channel}/>
                        <RoomRTC admins={this.state.admins}/>
                        <MoreStreams admins={this.state.admins} changeStream={this.changeStream} vote={this.vote}/>
                    </div>
                    <TwitchChat twitchChannel={this.state.channel}/>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Room);
