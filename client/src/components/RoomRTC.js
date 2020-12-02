import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import Peer from 'peerjs';
import axios from 'axios';
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
        console.log(call, 'USER CONNECTED')
        call.on('stream', userAudioStream  => {
            this.playUserAudio(userId, userAudioStream)
        })
    }

    componentWillUnmount() {
        this.peer.destroy();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            if (this.props.location.pathname.substring(1, 5) !== 'room') {
                this.fetchRoomInformation();
                this.setState({...this.state, miniRTC: true});
            } else {
                this.setState({...this.state, miniRTC: false});
            }
        }
    }

    updatePeersInRoom = async (peers) => {
        const updatePeers = new Promise((resolve, reject) => {
            //Create Ref of updatePeersList
            peers.forEach(thing => {
                this[`${thing}_ref`] = React.createRef()
            });

            //Add the peers state
            this.setState({
                peers: peers
            }, () => {
                resolve()
            })
        })
        return updatePeers;
    }

    closeCall = (event) => {
        event.stopPropagation();
        this.props.socket.emit('leave-room', this.props.activeRoom, localStorage.getItem('userId'))
        this.props.socket.emit('now-watching', localStorage.getItem('userId'), null, () => {

        })
        this.peer.disconnect();
        this.setState({miniRTC: false});
        this.props.leaveRoom();
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: this.props.activeRoom}})
            .then(response => {
                this.setState({roomTitle: response.data.room_title, admins: response.data.admins, channel: response.data.stream_channel})
            })
    }

    componentDidMount() {

        this.fetchRoomInformation();

        this.peer = new Peer(clientId, {
            host: 'https://alamo-peerjs.herokuapp.com',
            secure: true,
            host: 'alamo-peerjs.herokuapp.com',
            port: 443
        })

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this.props.socket.on('client-connected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList)
            })

            this.peer.on('call', call => {
                console.log(call, 'CLIENT CONNECTED')
                call.answer(stream);
                call.on('stream', userAudioStream => {
                    //Request updated peers list before routing call
                    this.props.socket.emit('request-peers', this.props.activeRoom, (peers) => {
                        console.log(peers)
                        this.updatePeersInRoom(peers)
                            .then(() => {
                                this.playUserAudio(call.peer, userAudioStream)
                            })
                    })
                })
            })

            this.peer.on('close', () => {
                console.log("CALL CLOSED")
            })

            this.peer.on('connection', () => {
                console.log('PEER CONNECTIOn')
            })

            this.peer.on('err', (err) => {
                console.log(err)
            })

            this.peer.on('disconnected', () => {
                console.log('CALL DISCONNECTED')
                this.peer.reconnect();
            })

            this.props.socket.on('user-connected', (userId, updatedPeersList) => {
                console.log('user connection', userId)
                this.updatePeersInRoom(updatedPeersList)
                    .then(() => {
                        //Connect user
                        this.connectToNewUser(userId, stream)
                    })

            })

            this.props.socket.on('user-disconnected', (userId, updatedPeersList) => {
                this.updatePeersInRoom(updatedPeersList);
            })

        })
    }

    redirect = (path) => {
        this.props.history.push(path)
    }

    handleMiniRTCClick = (event) => {
        this.redirect(event.currentTarget.id)
        this.props.showRoom();
    }

    render() {
        return(
            <div id={this.props.activeRoom} onClick={this.handleMiniRTCClick} className={this.state.miniRTC ? "container web-rtc mini-rtc-active d-block" : "container web-rtc d-none"} >
                <div className="row padding-top align-items-center">
                    <div className="col-9">
                        <h5>{this.state.roomTitle} <span className="rtc-room-size thin">{this.state.peers.length} / 6 </span></h5>
                        <h6 className="thin">Watching Counter-Strike...</h6>
                        {this.state.peers.map((userId) => {
                            return(
                                <div data-userid={userId}>
                                    <audio id={userId} key={'audio'+userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-3" style={{borderLeft: '1px solid white'}}>
                        <i className="hangup-room fas fa-3x font-color fa-phone-slash" onClick={this.closeCall}></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RoomRTC);
