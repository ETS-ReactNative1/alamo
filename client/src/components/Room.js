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

        this.state.peers.forEach(thing => {
            this[`${thing}_ref`] = React.createRef()
        });

    }

    playUserAudio = (userId, stream) => {
      this[`${userId}_ref`].current.srcObject = stream;
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

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.updateRoomChange();
        }
    }

    updateRoomChange = () => {
        //Disconnect from join before joining new room

        socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

        axios.get('/room-info', {params: {roomId: window.location.pathname}})
            .then(response => {
                this.setState({roomTitle: response.data[0].roomTitle})
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
                    //Create Ref 
                    this[`${userId}_ref`] = React.createRef()

                   //Add the peers state
                    this.setState({
                        peers: this.state.peers.concat(userId)
                    })

                    //Connect user
                    this.connectToNewUser(userId, stream)
                    console.log('user-connected', userId)
                })

                socket.on('user-disconnected', (userId) => {
                    console.log('user-disconnected', userId)
                })

                peer.on('call', call => {
                    call.answer(stream)
                })

                peer.on('close', call => {
                })
            })
            
            axios.get('/room-info', {params: {roomId: window.location.pathname}})
                .then(response => {
                    this.setState({roomTitle: response.data[0].roomTitle})
                })


        }, 300)
    }

    render() {
        return(
            <div>
                <h1 className="room-title">{this.state.roomTitle}</h1>
                <video className="room-video" src="" controls></video>
                <audio id={'1'} muted ref={client => {this.client = client}} controls volume="true" autoPlay />
                 {this.state.peers.map((userId) => {
                    return(
                          <audio key={userId} ref={this[`${userId}_ref`]} controls volume="true" autoPlay/>
                    )
                 })}
            </div>
        )
    }
}

export default Room;
