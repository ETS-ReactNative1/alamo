import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080')

class FriendCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                id: null,
                username: '',
                avatar: ''
            },
            online: false
        }
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
        if (this.props.userId in this.props.onlineUsers) {
                return this.setState({online: true})
            }

        socket.on('new-user-online', (userId, clients) => {
            console.log(clients)
            if (this.state.user.id === userId) {
                return this.setState({online: true})
            }

        })

        socket.on('user-offline', (userId, clients) => {
            
        })
    }


    render() {
        console.log(this.props.onlineUsers)
        return(
            <div id={this.props.userId} className="row sidebar-friend align-items-center">
                <div className="col-3">
                    {this.state.online ? <i class="fas fa-circle online"></i> : null }
                    <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + this.state.user.avatar + '-avatar.png'} />
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col">
                            <h3 className="username bold">{this.state.user.username}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h6 className="user-status thin">Watching Valorant...</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FriendCard;
