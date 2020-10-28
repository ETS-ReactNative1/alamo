import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import useForceUpdate from 'use-force-update';

import ProfileSetup from './ProfileSetup';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import Notification from './Notification';
import Room from './Room';
import Profile from './Profile';
import LogoutButton from './LogoutButton';
import CreateRoom from './CreateRoom';

const Dashboard = () => {
    const { user } = useAuth0();
    const [state, setState] = React.useState([])
    const forceUpdate = useForceUpdate();

    const fetchUserInformation = async () => {
        const response = await axios.get('/user', {params: {email: user.email}})
        setState(response.data[0])
    }

    React.useEffect(() => {
        const socket = io.connect('http://localhost:8080')
        
        socket.on('decline-friend-invite', (receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                console.log('declined invite')
                fetchUserInformation();
            }
        })

        socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                fetchUserInformation();
            }
        })
        fetchUserInformation();
    }, [])

    localStorage.setItem('userId', state._id)

    if (state.account_setup === false) {
        return(
            <ProfileSetup user={user}/>
        )
    } else {
        return (
            <Switch>
                <div className="container-fluid">
                    <div className="row">
                        <Sidebar user={state}/>
                        <main className="col px-4">
                            <NavigationBar/>
                            <Notification userId={state._id}/>
                            <Route path="/create-room" component={CreateRoom}/>
                            <Route path="/room/" component={Room}/>
                        </main>
                    </div>
                </div>
            </Switch>
        );
    }
}

export default Dashboard;
