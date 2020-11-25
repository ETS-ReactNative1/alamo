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
            speakingPeers: [],
            miniRTC: false
        }
    }

    playUserAudio = (userId, stream) => {
        //If connected user is client, then we want to mute that audio ref element
        if (userId === clientId) {
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
            if (this.props.location.pathname.substring(1, 5) === 'room') {
                this.setState({miniRTC: false})
                console.log('LEAVE ROOM')
                this.peer.disconnect();
                //Disconnect from join before joining new room
                this.props.socket.emit('leave-room', prevProps.location.pathname, clientId)
                this.updateRoomChange();
            } else {
                console.log('minimise rtc')
                this.setState({miniRTC: true})
            }
        }
    }

    updateRoomChange = (userId) => {

        this.peer = new Peer(clientId, {
            host: '/',
            port: '8081'
        })

        //Join new room
        this.props.socket.emit('join-room', window.location.pathname, clientId)
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

    componentDidMount() {

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this.updateRoomChange();

            this.props.socket.on('client-connected', (userId, updatedPeersList) => {
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

            this.props.socket.on('user-connected', (userId, updatedPeersList) => {
                console.log('user connection', userId)
                this.updatePeersInRoom(updatedPeersList);

                //Connect user
                this.connectToNewUser(userId, stream)
            })

            this.props.socket.on('user-disconnected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList);
            })

        })
    }

    render() {
        return(
            <div className={this.state.miniRTC ? "container web-rtc mini-rtc-active" : "container web-rtc"}>
                <div className="row room-avatar-row align-items-center">
                    <div className="col-9">
                        {this.state.peers.map((userId) => {
                            return(
                                <div data-userId={userId}>
                                    <h6>{userId} | </h6>
                                    <audio id={userId} key={userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-3" style={{borderLeft: '1px solid white'}}>
                        <i class="hangup-room fas fa-3x font-color fa-phone-slash"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RoomRTC);
