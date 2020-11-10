import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';

import ProfileSetup from './ProfileSetup';
import ContextMenu from './ContextMenu';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import Notification from './Notification';
import Room from './Room';
import CreateRoom from './CreateRoom';
import AccountSettings from './AccountSettings';

const Dashboard = (props) => {
    const { user } = useAuth0();
    const [state, setState] = React.useState([])
    const socket = io.connect('http://localhost:8080')

    //Fetch all information related to user
    const fetchUserInformation = async () => {
        const response = await axios.get('/user', {params: {email: user.email}})
        setState(response.data[0])
    }

    React.useEffect(() => {

        //If friend invite has been declined, update user
        socket.on('decline-friend-invite', (receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                console.log('declined invite')
                fetchUserInformation();
            }
        })
        
        //If friend invite has been accepted, update both accepter and acceptee users
        socket.on('accept-friend-invite', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId') || senderId === localStorage.getItem('userId')) {
                fetchUserInformation();
            }
        })

        //If user has sent an invite to become friends, update user to reflect pending invite
        socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                fetchUserInformation();
            }
        })

        fetchUserInformation();

    }, [])

    //Store userId (user primary key) on client side for ease of access throughout application
    localStorage.setItem('userId', state._id)

    //Handle Context Menu Click
    const handleContextMenu = (id, x, y) => {
        if (id === localStorage.getItem('userId')) {
            const contextMenu = {contextMenu: {type: 'profile', x: x, y: y}}
            setState({...state, contextMenu})
        }
    }

    const clearContextMenu = () => {
        const contextMenu = {contextMenu: {show: 'none', x: '-400px', y: '-400px'}}
        setState({...state, contextMenu})
    }

    //Pass up props to trigger online status, only if account setup has been completed
    if (state.account_setup === true) {
        props.changeOnlineStatus(state.account_setup);
    }

    //If new users has not completed a account setup, redirect to complete profile component
    if (state.account_setup === false) {
        return(
            <ProfileSetup user={user}/>
        )
    } else {
        return (
            <Switch>
                <div className="container-fluid">
                    <div className="row">
                        <ContextMenu status={state.contextMenu} />
                        <Sidebar user={state} handleContextMenu={handleContextMenu}/>
                        <main className="col px-4">
                            <NavigationBar/>
                            <Notification userId={state._id}/>
                            <Route path="/create-room" render={(props) => (<CreateRoom fetchUserInformation={(props) =>{ fetchUserInformation() }}/>)}/>
                            <Route path="/room/" component={Room}/>
                            <Route path="/account-settings" render={(props) => (<AccountSettings userInformation={state}/>)}/>
                        </main>
                    </div>
                </div>
            </Switch>
        );
    }
}

export default Dashboard;
