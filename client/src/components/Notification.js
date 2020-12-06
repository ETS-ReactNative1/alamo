import React from 'react';
import axios from 'axios';

import InviteAlert from './InviteAlert';

class Notification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            showInvite: false,
            inviteeId: '',
            inviterId: '',
            inviteRoomId: '',
            inviteStream: '',
            notification: null,
            pendingInvitation: '',
            friends: []
        }
    }

    closeNotificationTimer = (time) => {
        setTimeout(() => {
            this.setState({notification: null, show: false})
        }, time)
    }

    componentDidMount() {
        axios.get('/user', {params: {userId: localStorage.getItem('userId')}})
            .then((response) => this.setState({friends: response.data[0].friends}))
            .catch((err) => console.log(err))
    }


    componentWillMount() {

        this.props.socket.on('new-user-online', (userId) => {
            setTimeout(() => {
                if (userId != this.props.userId && this.state.friends.includes(userId, 0)) {
                    axios.get('/user', {params: {userId: userId}})
                        .then(response => {
                            let message = response.data[0].user_metadata.username + ' is now online'
                            this.setState({notification: message, show: true})
                            this.closeNotificationTimer(3000)
                        })

              
                } else {
                    this.setState({notification: null})
                }

            }, 500)
        })

        this.props.socket.on('inc-room-invite', (invitee, inviter, roomId) => {
            this.setState({showInvite: false}, () => {
                this.setState({showInvite: true, inviteeId: invitee, inviterId: inviter, inviteRoomId: roomId});
            })

            setTimeout(() => {
                this.setState({showInvite: false})
            }, 1000 * 30)
        })

        this.props.socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {

                axios.get('/user', {params: {userId: senderId}})
                .then(response => {
                    let message = response.data[0].user_metadata.username + ' would like to add you as a friend'
                    this.setState({notification: message, show: true, pendingInvitation: senderId})
                    this.closeNotificationTimer(3000)
                })

            }
        })

        this.props.socket.on('/accept-friend-invite', (senderId, receiverId) => {
            console.log('accepted friends request socket io', receiverId)
            if (receiverId === localStorage.getItem('userId')) {

                axios.get('/user', {params: {userId: senderId}})
                .then(response => {
                    let message = response.data[0].user_metadata.username + ' added you as a friend'
                    this.setState({notification: message, show: true, pendingInvitation: senderId})
                    this.closeNotificationTimer(3000)
                })
            }
        })
        
    }

    declineVote = () => {
        this.setState({showInvite: false})
    }

    render() {
        return(
            <React.Fragment>
                {this.state.showInvite ? <InviteAlert inviteeId={this.state.inviteeId} inviterId={this.state.inviterId} roomId={this.state.inviteRoomId} declineVote={this.declineVote}/> : null}
                <div update={this.state.pendingInvitation} className={(this.state.show) ? "toast show" : "toast"} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-body bold">
                        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                        <h6 className="toast-message">{this.state.notification}</h6>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Notification;
