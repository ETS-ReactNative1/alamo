import React, { Component } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Sidebar from './Sidebar';
import Profile from './Profile';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
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
