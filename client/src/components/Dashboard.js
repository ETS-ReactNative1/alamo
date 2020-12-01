import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Switch, withRouter } from 'react-router-dom';

import ContextMenu from './ContextMenu';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import Notification from './Notification';
import Room from './Room';
import EditRoom from './EditRoom';
import CreateRoom from './CreateRoom';
import RoomRTC from './RoomRTC';
import ChangeAvatar from './ChangeAvatar';
import AccountSettings from './AccountSettings';
import InviteFriends from './InviteFriends';

import MainWrapper from './MainWrapper';
import RoomShowcase from './RoomShowcase';
import PopularStreams from './PopularStreams';

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: [],
            admins: ["5fbd007cd13e171ac9d8f331"],
            show: false,
            activeRoom: null,
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
        if(window.location.pathname.substring(1, 5) === 'room') this.setState({activeRoom: window.location.pathname, show: true})
        
        this.unlisten = this.props.history.listen((location, action) => {
            if (window.location.pathname === this.state.activeRoom) this.setState({show: true})
            else this.setState({show: false})
        });

        this.fetchUserInformation();

        if (this.props.auth) {
            this.props.socket.on('new-user-online', (userId, users) => {
                this.setState({onlineUsers: users})
            })

            this.props.socket.on('user-offline-update', (users) => {
                this.setState({onlineUsers: users})
            })
        }

        this.props.socket.on('friend-event', (type) => {
            console.log('FRIEND EVENT', type)
            if (type === 'accept') this.fetchUserInformation();
            if (type === 'invite') this.fetchUserInformation();
        })
    }

    leaveRoom = () => {
        this.setState({...this.state, activeRoom: null, show: false}) 
        this.props.history.push('/');
    }

    //Handle Context Menu Click
    handleContextMenu = (id, type, x, y, onlineStatus) => {
        this.setState({contextMenu: {type: type, id: id, x: x, y: y, online: onlineStatus}})
    }

    clearContextMenu = () => {
        this.setState({contextMenu: {status: false, x: '-400px', y: '-400px'}})
    }

    showRoom = () => {
        this.setState({showRoom: true});
    }

    roomFavourited = () => {

    }

    render() {
        const rooms = this.props.user && this.props.user.rooms;
        return (
            <React.Fragment>
                <div className="container-fluid dashboard" onClick={this.clearContextMenu}>
                    <div className="row">

                        {this.state.activeRoom !== null ? 
                            <RoomRTC 
                                socket={this.props.socket} 
                                activeRoom={this.state.activeRoom} 
                                showRoom={this.showRoom} 
                                admins={this.state.admins} 
                                leaveRoom={this.leaveRoom}
                            /> : null}

                        <ContextMenu 
                            activeRoom={this.state.activeRoom}
                            socket={this.props.socket} 
                            status={this.state.contextMenu} 
                            fetchUserInformation={this.fetchUserInformation} 
                        />

                        <Sidebar 
                            socket={this.props.socket} 
                            showRoom={this.showRoom} 
                            activeRoom={this.state.activeRoom} 
                            changeRoom={this.changeRoom} 
                            user={this.state.user} 
                            handleContextMenu={this.handleContextMenu} 
                            onlineUsers={this.state.onlineUsers} 
                            friendsControlsActive={this.friendsControlsActive}
                            fetchUserInformation={this.fetchUserInformation}
                        />

                        <main className="col px-4">
                            <NavigationBar 
                                socket={this.props.socket}
                                activeRoom={this.state.activeRoom}
                            />

                            <Notification 
                                socket={this.props.socket} 
                                userId={this.state.user._id}
                            />
                            <Route path="/create-room" render={(props) => (
                                <CreateRoom 
                                    socket={this.props.socket} 
                                    fetchUserInformation={this.fetchUserInformation}
                                    friends={this.state.user.friends} 
                                    onlineUsers={this.state.onlineUsers}
                                    activeRoom={this.state.activeRoom}
                                />
                            )}/>

                            {this.state.activeRoom !== null ? 
                                <Room 
                                    socket={this.props.socket} 
                                    show={this.state.show} 
                                    activeRoom={this.state.activeRoom} 
                                    admins={this.props.admins} 
                                    rooms={this.props.user.rooms}
                                    fetchUserInformation={this.fetchUserInformation}
                                /> : null}
                            <Route path="/account-settings" render={(props) => (
                                <AccountSettings userInformation={this.state.user}/>
                            )}/>

                            <Route path="/invite-friends" render={(props) => (
                                <InviteFriends 
                                    socket={this.props.socket} 
                                    friends={this.state.user.friends} 
                                    onlineUsers={this.state.onlineUsers}
                                    activeRoom={this.state.activeRoom}
                                />
                            )}/>

                            <Route path="/change-avatar" render={(props) => (
                                <ChangeAvatar 
                                    fetchUserInformation={this.fetchUserInformation}
                                />
                            )}/>

                            <Route path="/edit" render={(props) => (
                                <EditRoom
                                    activeRoom={this.state.activeRoom}
                                    admins={this.state.admins}
                                />
                            )}/>

                            <Route path="/" render={(props) => (
                                <MainWrapper activeRoom={this.state.activeRoom}>
                                    {this.props.user.rooms ? 
                                        <RoomShowcase 
                                            activeRoom={this.state.activeRoom}
                                            socket={this.props.socket} 
                                            rooms={this.props.user.rooms}
                                        />
                                    : null}
                                    <PopularStreams admins={this.state.admins}/>
                                </MainWrapper>
                            )}/>

                        </main>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Dashboard);
