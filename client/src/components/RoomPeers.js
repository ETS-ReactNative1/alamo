import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import Peer from 'peerjs';
import axios from 'axios';
import RoomUser from './RoomUser';
import hark from 'hark';

const clientId = localStorage.getItem('userId');

class RoomRTC extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            peers: [],
            roomTitle: null,
            speakingPeers: []
        }
    }

    updatePeersInRoom = (peers) => {
        //Add the peers state
        this.setState({
            peers: peers
        })
    }

    voiceActivation = (status) => {
        if (status) {
            const speaking = this.state.speakingPeers.concat(localStorage.getItem('userId'));
            this.setState({...this.state, speakingPeers: speaking})
            this.props.socket.emit('voice-active', window.location.pathname, localStorage.getItem('userId'))
        } else {
            const notSpeaking = this.state.speakingPeers.filter((user) => user !== localStorage.getItem('userId'));
            this.setState({...this.state, speakingPeers: notSpeaking})
            this.props.socket.emit('voice-inactive', window.location.pathname, localStorage.getItem('userId'))
        }
    }

    componentDidMount() {

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this.props.socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

            const speakingEvents = hark(stream, {threshold: '-55', interval: '50'})

            speakingEvents.on('speaking', () => this.voiceActivation(true))
            speakingEvents.on('stopped_speaking', () => this.voiceActivation(false))

            this.props.socket.on('client-connected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList)
            })

            this.props.socket.on('user-connected', (userId, updatedPeersList) => {
                console.log('user-connected', userId, updatedPeersList)
                console.log(this.state.peers)
                this.updatePeersInRoom(updatedPeersList);
            })

            this.props.socket.on('user-disconnected', (userId, updatedPeersList) => {
                console.log('user-disconnected', userId)
                this.updatePeersInRoom(updatedPeersList);
            })

            this.props.socket.on('user-speaking', (userId) => {
                const speaking = this.state.speakingPeers.concat(userId);
                this.setState({...this.state, speakingPeers: speaking})
            })

            this.props.socket.on('user-stopped-speaking', (userId) => {
                const notSpeaking = this.state.speakingPeers.filter((user) => user !== userId);
                this.setState({...this.state, speakingPeers: notSpeaking})
            })
        })
    }

    render() {
        return(
            <div className="row room-avatar-row align-items-center">
                {this.state.peers.map((userId) => {
                    return(
                        <div data-userId={userId}>
                            <RoomUser speakingPeers={this.state.speakingPeers} userId={userId} admins={this.props.admins}/>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default withRouter(RoomRTC);
