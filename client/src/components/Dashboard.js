import React, { Component } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import ProfileSetup from './ProfileSetup';
import Sidebar from './Sidebar';
import Profile from './Profile';
import LogoutButton from './LogoutButton';

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

    if (state.account_setup === false) {
        return(
            <ProfileSetup/>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <Sidebar/>
                <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <Profile/>
                    <LogoutButton/>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
