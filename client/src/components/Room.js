import React from 'react';
import io from 'socket.io-client';

let socket = io.connect('http://localhost:8080/')

class Room extends React.Component {
    constructor(props) {
        super(props)
    }

    playAudio = (stream) => {
        this.audio.srcObject = stream;
    }

    componentDidMount() {
        setTimeout(() => {
            socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                this.playAudio(stream)
            })

            socket.on('user-connected', (userId) => {
                console.log('user-connected', userId)
            })

        }, 500)
    }
    render() {
        return(
            <div>
               <h2>Room</h2>
               <video src=""></video>
                <audio ref={audio => {this.audio = audio}} controls volume="true" autoPlay />
            </div>
        )
    }
}

export default Room;
