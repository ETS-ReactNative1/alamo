import React, { Component } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Profile from './Profile';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <LogoutButton/>
            <Profile/>
        </div>
    );
}

export default Dashboard;
