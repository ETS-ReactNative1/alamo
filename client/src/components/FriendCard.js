import React from 'react';
import axios from 'axios';

import UserAvatar from './UserAvatar';

class FriendCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                id: null,
                username: '',
                avatar: ''
            },
            online: false,
            status: ''
        }
    }

    handleContextClick = (event) => {
        event.preventDefault();
        const x_pos = event.pageX.toString() + 'px';
        const y_pos = event.pageY.toString() + 'px';
        const online = event.currentTarget.getAttribute('data-online');
        console.log(online)
        this.props.handleContextMenu(event.currentTarget.id, 'friend', x_pos, y_pos, online)
    }


    fetchUserInformation = async () => {
        axios.get('/user', {params: {userId: this.props.userId}})
            .then((response) => {
                this.setState({user: {id: response.data[0]._id, username: response.data[0].user_metadata.username, avatar: response.data[0].user_metadata.avatar}})
            })
            .catch((err) => console.log(err))
    }

    componentDidMount() {
        this.fetchUserInformation()
        //If users is currently already in client object, show them as online
        if (this.props.userId in this.props.onlineUsers) {
                this.setState({online: true})
            }

        //Listen for whether user comes online
        this.props.socket.on('new-user-online', (userId, clients) => {
            if (this.state.user.id === userId) {
                this.setState({online: true})
            }
        })

        this.props.socket.on('offline', (user) => {
            if (user === this.props.userId)
                this.props.userOffline(user);
                this.setState({online: false})
        })

        //Check the current status of all online status on load
        this.props.socket.emit('check-status', this.props.userId, (status) => {
            this.setState({status: status})
        })

        //Listen for change in the stream that a friend is currently watching
        this.props.socket.on('update-status', (user, game) => {
            if (user === this.props.userId) {
                const message = 'Watching ' + game
                this.setState({status: message})
            }
        })
    }


    render() {
        return(
            <div id={this.props.userId} key={this.props.userId} data-online={this.state.online} className="row sidebar-friend align-items-center" onContextMenu={this.handleContextClick}>
                <div className="col-3 friend-card-avatar">
                    {this.state.online ? <i className="fas fa-circle online"></i> : null }
                    <UserAvatar avatar={this.state.user.avatar}/>
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col">
                            <h3 className="username bold">{this.state.user.username}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h6 className="user-status overflow-dots thin">{this.state.status}</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FriendCard;
