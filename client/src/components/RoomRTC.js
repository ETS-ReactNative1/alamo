import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';
import RoomUser from './RoomUser';
import hark from 'hark';

let socket = io.connect('http://localhost:8080/')

class RoomRTC extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            peers: [],
            roomTitle: null,
            speakingPeers: []
        }
    }

    playUserAudio = (userId, stream) => {
        //If connected user is client, then we want to mute that audio ref element
        if (userId === localStorage.getItem('userId')) {
            this[`${userId}_ref`].current.srcObject = stream;
            this[`${userId}_ref`].current.muted = true;
        } else {
            this[`${userId}_ref`].current.srcObject = stream;
        }
    }

    connectToNewUser = (userId, stream) => {
        const call = this.peer.call(userId, stream)
        call.on('stream', userAudioStream  => {
            this.playUserAudio(userId, userAudioStream)
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.peer.disconnect();

            //Disconnect from join before joining new room
            socket.emit('leave-room', prevProps.location.pathname, localStorage.getItem('userId'))

            this.updateRoomChange();
        }
    }

    updateRoomChange = (userId) => {

        this.peer = new Peer(localStorage.getItem('userId'), {
            host: '/',
            port: '8081'
        })

        //Join new room
        socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))
    }

    updatePeersInRoom = (peers) => {
        //Create Ref of updatePeersList
        peers.forEach(thing => {
            this[`${thing}_ref`] = React.createRef()
        });

        //Add the peers state
        this.setState({
            peers: peers
        })
    }

    voiceActivation = (status) => {
        if (status) {
            const speaking = this.state.speakingPeers.concat(localStorage.getItem('userId'));
            this.setState({...this.state, speakingPeers: speaking})
            socket.emit('voice-active', window.location.pathname, localStorage.getItem('userId'))
        } else {
            const notSpeaking = this.state.speakingPeers.filter((user) => user !== localStorage.getItem('userId'));
            this.setState({...this.state, speakingPeers: notSpeaking})
            socket.emit('voice-inactive', window.location.pathname, localStorage.getItem('userId'))
        }
    }

    componentDidMount() {

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            const speakingEvents = hark(stream, {threshold: '-55', interval: '50'})

            speakingEvents.on('speaking', () => this.voiceActivation(true))
            speakingEvents.on('stopped_speaking', () => this.voiceActivation(false))

            this.updateRoomChange();

            socket.on('client-connected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList);

                //Once client is connected and state is update with peers, connect client audio
                this.playUserAudio(localStorage.getItem('userId'), stream)

                this.peer.on('call', call => {
                    call.answer(stream);
                    call.on('stream', userAudioStream => {
                        this.playUserAudio(call.peer, userAudioStream)
                    })
                })

            })

            socket.on('user-connected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList);

                //Connect user
                this.connectToNewUser(userId, stream)
            })

            socket.on('user-disconnected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList);
            })

            socket.on('user-speaking', (userId) => {
                const speaking = this.state.speakingPeers.concat(userId);
                this.setState({...this.state, speakingPeers: speaking})
            })

            socket.on('user-stopped-speaking', (userId) => {
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
                        <React.Fragment>
                            <RoomUser speakingPeers={this.state.speakingPeers} userId={userId} admins={this.props.admins}/>
                            <audio id={userId} key={userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                        </React.Fragment>
                    )
                })}
            </div>
        )
    }
}

export default withRouter(RoomRTC);
