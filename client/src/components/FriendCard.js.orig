import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080')

<<<<<<< HEAD
class FriendCard extends React.Component {
    constructor(props) {
        super(props)
=======
const FriendCard = (props) => {
    const [state, setState] = React.useState([])
    const socket = io.connect('https://alamo-d19124355.herokuapp.com/')
>>>>>>> more updated socket.io connects with heroku url

        this.state = {
            user: {
                id: null,
                username: '',
                avatar: ''
            },
            online: false
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
        if (this.props.userId in this.props.onlineUsers) {
                return this.setState({online: true})
            }

        socket.on('new-user-online', (userId, clients) => {
            if (this.state.user.id === userId) {
                return this.setState({online: true})
            }

        })
    }


    render() {
        return(
            <div id={this.props.userId} data-online={this.state.online} className="row sidebar-friend align-items-center" onContextMenu={this.handleContextClick}>
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
