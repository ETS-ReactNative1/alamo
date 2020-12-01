import React from 'react';
import ReactDOM from 'react-dom';
import Peer from 'peerjs';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

import RoomUser from './RoomUser';
import RoomRTC from './RoomRTC';
import RoomPeers from './RoomPeers';
import TwitchPlayer from './TwitchPlayer';
import TwitchChat from './TwitchChat';
import TwitchLogin from './TwitchLogin';
import FavouriteBtn from './FavouriteBtn';
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
            usersInRoom: 1,
            votesNeeded: 1,
            yesVotes: 1,
            yesUsers: [],
            noVotes: 0,
            noUsers: [],
            streamId: '',
            stream: {}
        }
    }

    fetchStream = (streamId) => {
        axios.get('/twitchapi/streams', {params : {user_id: streamId}})
            .then((response) => {
                this.setState({stream: response.data[0]})
                console.log(response)
                //Emit to server, than user is currently watching this game
                this.props.socket.emit('now-watching', localStorage.getItem('userId'), response.data[0].game_name, () => {

                })
            })
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: this.props.activeRoom}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title, admins: response.data.admins, streamId: response.data.stream})
                this.fetchStream(response.data.stream)
            })
    }

    changeStream = (event) => {
        const streamId = event.currentTarget.id
        this.setState({streamId: streamId})
        axios.post('/room/change-stream', {roomId: this.props.activeRoom, channel: streamId})
            .then((response) => {
                console.log('fire response')
                this.props.socket.emit('change-stream', this.props.activeRoom, streamId)
            })
            .catch((err) => console.log(err))
    }

    vote = (event) => {
        const channelId = event.currentTarget.id;
        const channel = event.currentTarget.getAttribute('data-channel')
        const gameId = event.currentTarget.getAttribute('data-gameid');
        const thumbnail = event.currentTarget.getAttribute('data-image');
        const avatar = event.currentTarget.getAttribute('data-channel-image');
        const title = event.currentTarget.getAttribute('data-stream-title');
        const stream = {gameId : gameId, channelId: channelId, channel: channel, thumbnail: thumbnail, avatar: avatar, title: title};

        if (!this.state.vote) 
            this.props.socket.emit('start-vote', this.props.activeRoom, localStorage.getItem('userId'), stream)

        if (this.state.vote)
            alert('Vote already in progress')

        if (this.state.vote)

        this.voteTimer = setTimeout(() => {
            this.props.socket.emit('finish-vote', this.props.activeRoom, 'failed')
        }, 1000 * 30)
    }

    votingActions = (event) => {
        this.props.socket.emit('vote-actions', this.props.activeRoom, localStorage.getItem('userId'), event.currentTarget.id)
    }

    componentWillUnmount() {
        this.props.socket.emit('leave-room', this.props.activeRoom, localStorage.getItem('userId'))
    }

    componentDidMount() {

        this.props.socket.emit('join-room', this.props.activeRoom, localStorage.getItem('userId'));

        this.props.socket.on('update-stream', (stream) => {
            console.log('UPDATE STREAM', stream)
            this.setState({streamId: stream}, () => {
                this.fetchStream(stream);
            })
        })

        this.props.socket.on('vote', (userId, stream, usersInRoom) => {
            console.log(stream)
            this.setState({...this.state, vote: true, voterId: userId, voterChannel: stream, usersInRoom: usersInRoom, yesUsers: [userId]})
            if (usersInRoom % 2 === 0 && usersInRoom > 2) {
                const votesNeeded = Math.ceil(this.state.usersInRoom / 2)
            } else if (usersInRoom === 1) {
                this.setState({...this.state, votesNeeded: 1})
                this.props.socket.emit('finish-vote', this.props.activeRoom, 'passed')
                clearTimeout(this.voteTimer);
            } else {
                const votesNeeded = Math.ceil(this.state.usersInRoom / 2) + 1
                this.setState({...this.state, votesNeeded: votesNeeded})

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

            if (this.state.yesVotes === this.state.votesNeeded) {
                this.props.socket.emit('finish-vote', this.props.activeRoom, 'passed')
            }   

            if ((this.state.yesVotes + this.state.noVotes) === this.state.votesNeeded) {
                this.props.socket.emit('finish-vote', this.props.activeRoom, 'failed')
            }
        })

        this.props.socket.on('end-vote', (result) => {
            if (result === 'passed') {
                clearTimeout(this.voteTimer);
                this.props.socket.emit('change-stream', this.props.activeRoom, this.state.voterChannel.channelId)           
            } else {
                clearTimeout(this.voteTimer);
                this.setState({...this.state, vote: false, yesVotes: 1, noVotes: 0, noUsers: [], yesUsers: []})
            }
        })

        this.fetchRoomInformation();
    }

    render() {
        return(
            <React.Fragment>
                {this.state.vote ? <Vote yesUsers={this.state.yesUsers} noUsers={this.state.noUsers} yesVotes={this.state.yesVotes} noVotes={this.state.noVotes} usersInRoom={this.state.usersInRoom} votesNeeded={this.state.votesNeeded} voterId={this.state.voterId} votingActions={this.votingActions} stream={this.state.voterChannel}/> : null}
                <div className={this.props.show ? "room-container show-room d-flex" : "room-container d-flex"}>
                    <div className="container-fluid">
                        <h1 className="room-title">{this.state.roomTitle}</h1>
                        <TwitchPlayer twitchChannel={this.state.stream.user_name}/>
                        <div className="row room-avatar-row justify-content-between">
                            <RoomPeers socket={this.props.socket} admins={this.state.admins}/>
                            <div className="col-4 d-flex flex-row-reverse">
                                <i className="fas fa-2x fa-cog room-settings-icon font-color"></i>
                                <FavouriteBtn fetchUserInformation={this.props.fetchUserInformation} activeRoom={this.props.activeRoom}/>
                                <button className="primary-btn small-btn-invite" style={{maxWidth: '100px'}} onClick={() => this.props.history.push('/invite-friends')}>Invite</button>
                            </div>
                        </div>

                        {this.state.stream.game_id ? <MoreStreams admins={this.state.admins} gameId={this.state.stream.game_id} changeStream={this.changeStream} vote={this.vote}/> : null}
                    </div>
                    <TwitchChat twitchChannel={this.state.stream.user_name}/>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Room);
