import React from 'react';
import ReactDOM from 'react-dom';
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

class Room extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            roomTitle: '',
            admins: '',
            channel: '',
            vote: false,
            voterId: '',
            voterChannel: '',
            usersInRoom: 2,
            votesNeeded: 2,
            yesVotes: 1,
            yesUsers: [],
            noVotes: 0,
            noUsers: []
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
                this.props.socket.emit('change-stream', window.location.pathname, channel)
            })
            .catch((err) => console.log(err))
    }

    vote = (event) => {
        const channel = event.currentTarget.id
        const thumbnail = event.currentTarget.getAttribute('data-image')
        const avatar = event.currentTarget.getAttribute('data-channelImage')
        const title = event.currentTarget.getAttribute('data-streamTitle')
        const stream = {channel: channel, thumbnail: thumbnail, avatar: avatar, title: title}

        if (!this.state.vote) 
            this.props.socket.emit('start-vote', window.location.pathname, localStorage.getItem('userId'), stream)

        if (this.state.vote)
            alert('Vote already in progress')

        setTimeout(() => {
            this.props.socket.emit('finish-vote', window.location.pathname, 'failed')
        }, 1000 * 30)
    }

    votingActions = (event) => {
        this.props.socket.emit('vote-actions', window.location.pathname, localStorage.getItem('userId'), event.currentTarget.id)
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchRoomInformation();
        } 
    }

    componentDidMount() {
        this.props.socket.on('update-stream', (roomId, stream) => {
            this.setState({channel: stream})
        })

        this.props.socket.on('vote', (userId, stream, usersInRoom) => {
            if (usersInRoom % 2 === 0 && usersInRoom > 2) {
                const votesNeeded = Math.ceil(this.state.usersInRoom / 2)
                this.setState({...this.state, vote: true, voterId: userId, voterChannel: stream, usersInRoom: usersInRoom, votesNeeded: votesNeeded, yesUsers: [userId]})
            } else {
                const votesNeeded = Math.ceil(this.state.usersInRoom / 2) + 1
                this.setState({...this.state, vote: true, voterId: userId, voterChannel: stream, votesNeeded: votesNeeded, yesUsers: [userId]})
            }
        });

        this.props.socket.on('vote-poll', (userId, vote) => {
            if (vote === 'yes') {
                const newYesVote = this.state.yesUsers.concat(userId);
                this.setState({...this.state, yesVotes: this.state.yesVotes + 1, yesUsers: newYesVote})
            }

            if (vote === 'no') {
                const newNoVote = this.state.noUsers.concat(userId);
                this.setState({...this.state, noVotes: this.state.noVotes + 1, noUsers: newNoVote})
            }

            if (this.state.yesVotes === this.state.votesNeeded) this.props.socket.emit('finish-vote', window.location.pathname, 'passed')
            if ((this.state.yesVotes + this.state.noVotes) === this.state.votesNeeded) this.props.socket.emit('finish-vote', window.location.pathname, 'failed')

        })

        this.props.socket.on('end-vote', (result) => {
            if (result === 'passed') {
                this.props.socket.emit('change-stream', window.location.pathname, this.state.voterChannel.channel)           
            } else {
                this.setState({...this.state, vote: false, yesVotes: 1, noVotes: 0, noUsers: [], yesUsers: []})
            }
        })

        this.fetchRoomInformation();
    }

    render() {
        return(
            <React.Fragment>
                {this.state.vote ? <Vote yesUsers={this.state.yesUsers} noUsers={this.state.noUsers} yesVotes={this.state.yesVotes} noVotes={this.state.noVotes} usersInRoom={this.state.usersInRoom} votesNeeded={this.state.votesNeeded} voterId={this.state.voterId} votingActions={this.votingActions} stream={this.state.voterChannel}/> : null}
                <div className="room-container d-flex">
                    <div className="container-fluid">
                        <h1 className="room-title">{this.state.roomTitle}</h1>
                        <TwitchPlayer twitchChannel={this.state.channel}/>
                        <RoomRTC socket={this.props.socket} admins={this.state.admins}/>
                        <MoreStreams admins={this.state.admins} changeStream={this.changeStream} vote={this.vote}/>
                    </div>
                    <TwitchChat twitchChannel={this.state.channel}/>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Room);
