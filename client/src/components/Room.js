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
        
        this.state = {
            peers: [],
            roomTitle: null
        }
    }

    playUserAudio = (audio, stream) => {
        if (audio === 'audio2') {
            this.audio2.srcObject = stream;
        } else if (audio === 'audio3') {
            this.audio3.srcObject = stream;
        } else {
            this.audio.srcObject = stream;
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
            this.playUserAudio('audio2', stream)
        })

        call.on('close', () => {
            console.log('CALL CLOSED')
        })
    }

    componentWillMount() {
        socket.on('user-disconnected', (userId) => {
            //Remove user from peers array
            const updatePeers = this.state.peers.splice(this.state.peers.indexOf(userId), 1);
            this.setState({peers: updatePeers})
            console.log(this.state.peers, 'after user removed')
            console.log('user-disconnected', userId)
        })
    }

    componentDidMount() {
        setTimeout(() => {
            
            socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                this.playClientAudio(stream)


                socket.on('user-connected', (userId) => {
                    this.connectToNewUser(userId, stream)
                    console.log('user-connected', userId)
                })

                socket.on('user-disconnected', (userId) => {
                    console.log('user-disconnected', userId)
                })

                peer.on('call', call => {
                    call.answer(stream)
                    console.log('answered call')
                })
            })
            
            axios.get('/room-info', {params: {roomId: window.location.pathname}})
                .then(response => {
                    this.setState({roomTitle: response.data[0].roomTitle})
                })


        }, 50)
    }
    render() {
        return(
            <div>
                <h1 className="room-title">{this.state.roomTitle}</h1>
                <video className="room-video" src="" controls></video>
                <audio id={'1'} muted ref={client => {this.client = client}} controls volume="true" autoPlay />
                <audio id={'4'} muted ref={external => {this.external = external}} controls volume="true" autoPlay />
                <audio id={'2'} ref={audio2 => {this.audio2 = audio2}} controls volume="true" autoPlay />
                <audio id={'3'} muted ref={audio3 => {this.audio3 = audio3}} controls volume="true" autoPlay />
            </div>
        )
    }
}

export default Room;
