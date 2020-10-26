import React from 'react';
import io from 'socket.io-client';

let socket = io.connect('http://localhost:8080/')

class Room extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        setTimeout(() => {
            socket.emit('join-room', window.location.pathname, localStorage.getItem('userId'))

            socket.on('user-connected', (userId) => {
                console.log('user-connected', userId)
            })

        }, 500)
    }
    render() {
        return(
           <h2>Room</h2>
        )
    }
}

export default Room;
