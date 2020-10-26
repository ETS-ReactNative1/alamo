import React from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

let socket = io.connect('http://localhost:8080/')

const peer = new Peer(localStorage.getItem('userId'), {
    host: '/',
    port: '8081'
})

class Room extends React.Component {
    constructor(props) {
        super(props)
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

    connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream)
        call.on('stream', userAudioStream  => {
            this.playUserAudio('audio2', userAudioStream)
        })

        call.on('close', () => {
            console.log('CALL CLOSED')
        })
    }

    componentWillMount() {
        socket.on('user-disconnected', (userId) => {
            console.log('user-disconnected', userId)
        })
    }

    componentDidMount() {
        setTimeout(() => {
            
            socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                this.playUserAudio('audio', stream)


                socket.on('user-connected', (userId) => {
                    this.connectToNewUser(userId, stream)
                    console.log('user-connected', userId)
                })

                socket.on('user-disconnected', (userId) => {
                    console.log('user-disconnected', userId)
                })

                peer.on('call', call => {
                    call.answer(stream)
                    call.on('stream', userAudioStream => {
                        this.playUserAudio('audio2', userAudioStream)
                    })
                    console.log('answered call')
                })

            })


        }, 500)
    }
    render() {
        return(
            <div>
               <h2>Room</h2>
               <audio id={'1'} muted ref={audio => {this.audio = audio}} controls volume="true" autoPlay />
               <audio id={'2'} ref={audio2 => {this.audio2 = audio2}} controls volume="true" autoPlay />
               <audio id={'3'} muted ref={audio3 => {this.audio3 = audio3}} controls volume="true" autoPlay />
            </div>
        )
    }
}

export default Room;
