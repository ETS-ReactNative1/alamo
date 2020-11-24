import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Switch } from 'react-router-dom';

import ContextMenu from './ContextMenu';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import Notification from './Notification';
import Room from './Room';
import CreateRoom from './CreateRoom';
import AccountSettings from './AccountSettings';

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: [],
            contextMenu: {
                type: '',
                id: '',
                x: '',
                y: '',
                online: ''
            },
            onlineUsers: {}
        }
    }

    //Fetch all information related to user
    fetchUserInformation = async () => {
        axios.get('/auth/user')
            .then((response) => {
                this.setState({user: response.data})
            })
    }

    componentDidMount() {
        window.addEventListener("beforeunload", function(event) { 
            this.props.socket.emit('user-offline', localStorage.getItem('userId'))
        });

        this.fetchUserInformation();

        if (this.props.auth) {
            this.props.socket.on('new-user-online', (userId, clients) => {
                this.setState({onlineUsers: clients})
            })

            this.props.socket.on('user-offline-update', (clients) => {
                this.setState({onlineUsers: clients})
            })
        }

        //If friend invite has been declined, update user
        this.props.socket.on('decline-friend-invite', (receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                console.log('declined invite')
                this.fetchUserInformation();
            }
        })
        
        //If friend invite has been accepted, update both accepter and acceptee users
        this.props.socket.on('accept-friend-invite', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId') || senderId === localStorage.getItem('userId')) {
                this.fetchUserInformation();
            }
        })

        //If user has sent an invite to become friends, update user to reflect pending invite
        this.props.socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                this.fetchUserInformation();
            }
        })
    }


    //Handle Context Menu Click
    handleContextMenu = (id, type, x, y, onlineStatus) => {
        this.setState({contextMenu: {type: type, id: id, x: x, y: y, online: onlineStatus}})
    }

    clearContextMenu = () => {
        this.setState({contextMenu: {status: false, x: '-400px', y: '-400px'}})
    }

    render() {
        const rooms = this.props.user && this.props.user.rooms;
        return (
        <React.Fragment>
            <div className="container-fluid" onClick={this.clearContextMenu}>
                <div className="row">
                    <ContextMenu socket={this.props.socket} status={this.state.contextMenu} fetchUserInformation={this.fetchUserInformation} />
                    <Sidebar socket={this.props.socket} user={this.state.user} handleContextMenu={this.handleContextMenu} onlineUsers={this.state.onlineUsers}/>
                    <main className="col px-4">
                        <NavigationBar/>
                        <Notification socket={this.props.socket} userId={this.state.user._id}/>
                        <Route path="/create-room" render={(props) => (<CreateRoom socket={this.props.socket} fetchUserInformation={this.fetchUserInformation}/>)}/>
                        <Route path="/room/" render={(props) => <Room socket={this.props.socket} rooms={this.props.user.rooms} fetchUserInformation={this.fetchUserInformation}/>}/>
                        <Route path="/account-settings" render={(props) => (<AccountSettings userInformation={this.state.user}/>)}/>
                    </main>
                </div>
            </div>
        </React.Fragment>
        );
    }
}

export default Dashboard;
