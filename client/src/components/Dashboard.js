import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import ProfileSetup from './ProfileSetup';
import Sidebar from './Sidebar';
import Profile from './Profile';
import LogoutButton from './LogoutButton';
import CreateRoom from './CreateRoom';

import io from 'socket.io-client';

const createRoom = () => {
    let socket =  io.connect('http://localhost:8080');
    socket.emit('join-room', 829018201, localStorage.getItem('userId'))
}

const Dashboard = () => {
    const { user } = useAuth0();
    const [state, setState] = React.useState([])

    React.useEffect(() => {
        const fetchUserInformation = async () => {
            const response = await axios.get('/user', {params: {email: user.email}})
            setState(response.data[0])
        }
        fetchUserInformation();
    }, [])

    console.log(state._id, "IDDDDD")
    localStorage.setItem('userId', state._id)

    if (state.account_setup === false) {
        return(
            <ProfileSetup user={user}/>
        )
    } else {
        console.log(state)
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar user={state}/>
                    <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
                        <Profile/>
                        <LogoutButton/>
                        <CreateRoom/>
                    </main>
                </div>
            </div>
        );
    }
}

export default Dashboard;
