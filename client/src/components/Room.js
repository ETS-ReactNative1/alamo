import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';

let socket = io.connect('http://localhost:8080/')

const peer = new Peer(localStorage.getItem('userId'), {
    host: '/',
    port: '8081'
})

class Room extends React.Component {
    constructor(props) {
        super(props)

        //Find way to dyanamically added audio refs - https://medium.com/@jalexmayer/react-refs-with-dynamic-names-d2262ab0a0b0        
        this.state = {
            peers: [],
            roomTitle: null,
            activeCall: ''
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

    playClientAudio = (stream) => {
        this.client.srcObject = stream
    }

    playExternalAudio = (userId, stream) => {
        return(
            <h2>hello</h2>
        )
    }

    connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream)
        call.on('stream', userAudioStream  => {
            this.playUserAudio(userId, stream)
        })

        call.on('close', () => {
            console.log('CALL CLOSED')
        })

    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.updateRoomChange();
        }
    }

    updateRoomChange = (userId) => {
        //Disconnect from join before joining new room
        socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

        axios.get('/room-info', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data[0].roomTitle})
            })

    }

    componentDidMount() {
        setTimeout(() => {
            
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {

                socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

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
                    console.log('client connected')
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

                    //Connect user
                    this.connectToNewUser(userId, stream)
                })

                peer.on('call', call => {
                    call.answer(stream);
                    console.log(call.peer, 'THIS IS PEER')
                    call.on('stream', userAudioStream => {
                        this.playUserAudio(call.peer, userAudioStream)
                    })
                })

                peer.on('close', call => {
                })
            })
            
            axios.get('/room-info', {params: {roomId: window.location.pathname}})
                .then(response => {
                    this.setState({roomTitle: response.data[0].roomTitle})
                })


        }, 1000)
    }

    render() {
        return(
            <div>
                <h1 className="room-title">{this.state.roomTitle}</h1>
                <video className="room-video" src="" controls></video>
                 {this.state.peers.map((userId) => {
                    return(
                          <audio id={userId} key={userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                    )
                 })}
            </div>
        )
    }
}

export default Room;
