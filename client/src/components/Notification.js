import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

class Notification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            notification: null
        }
    }

    componentWillMount() {

        const socket = io.connect('http://localhost:8080')

        socket.on('new-user-online', (userId) => {
            setTimeout(() => {
                if (userId != this.props.userId) {
                    axios.get('userId', {params: {userId: userId}})
                        .then(response => {
                            let message = response.data[0].user_metadata.username + ' is now online'
                            this.setState({notification: message, show: true})
                        })

                    setTimeout(() => {
                        this.setState({notification: null, show: false})
                    }, 3000)

                } else {
                    this.setState({notification: null})
                }

            }, 500)
        })

        socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {

                axios.get('userId', {params: {userId: senderId}})
                .then(response => {
                    let message = response.data[0].user_metadata.username + ' would like to add you as a friend'
                    this.setState({notification: message, show: true})
                })

                setTimeout(() => {
                    this.setState({notification: null, show: false})
                }, 3000)
            }
        })
        
    }

    render() {
        return(
            <div className={(this.state.show) ? "toast show" : "toast"} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-body bold">
                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                        <h6 className="toast-message">{this.state.notification}</h6>
                    </div>
            </div>
        )
    }
}

export default Notification;
