import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';
import RoomUser from './RoomUser';

const socket = io.connect('https://alamo-d19124355.herokuapp.com/')


class RoomRTC extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            peers: [],
            roomTitle: null,
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

        call.on('close', () => {
            console.log('CALL CLOSED')
        })

    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.peer.disconnect();
            console.log(this.peer)
            console.log(prevProps.location, 'this is what is sent to leave room')

            //Disconnect from join before joining new room
            socket.emit('leave-room', prevProps.location.pathname, localStorage.getItem('userId'))

            this.updateRoomChange();
        }
    }

    updateRoomChange = (userId) => {

        this.peer = new Peer(localStorage.getItem('userId'), {
            host: 'https://alamo-peerjs.herokuapp.com',
            secure: true,
            host: 'alamo-peerjs.herokuapp.com',
            port: 443
        })

        //Join new room
        socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))
    }

    componentDidMount() {

        setTimeout(() => {
            
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {

                this.updateRoomChange();
                socket.on('client-connected', (userId, updatedPeersList) => {
                    //Create Ref of updatePeersList
                    updatedPeersList.forEach(thing => {
                        this[`${thing}_ref`] = React.createRef()
                    });

                    //Add the peers state
                    this.setState({
                        peers: updatedPeersList
                    })

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
                    //Create Ref of updatePeersList
                    updatedPeersList.forEach(thing => {
                        this[`${thing}_ref`] = React.createRef()
                    });

                    //Add the peers state
                    this.setState({
                        peers: updatedPeersList
                    })

                    //Connect user
                    this.connectToNewUser(userId, stream)
                    console.log('user-connected', userId)
                })

                socket.on('user-disconnected', (userId, updatedPeersList) => {
                    //Create Ref of updatePeersList
                    updatedPeersList.forEach(thing => {
                        this[`${thing}_ref`] = React.createRef()
                    });

                    //Add the peers state
                    this.setState({
                        peers: updatedPeersList
                    })

                    console.log('user-disconnected', userId)
                })
            })
            
        }, 1000)
    }

    render() {
        return(
            <div className="row room-avatar-row align-items-center">
                {this.state.peers.map((userId) => {
                    return(
                        <React.Fragment>
                            <RoomUser userId={userId} admins={this.props.admins}/>
                            <audio id={userId} key={userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                        </React.Fragment>
                    )
                })}
            </div>
        )
    }
}

export default withRouter(RoomRTC);
