import React, { Component } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout({ returnTo: window.location.origin })} class="btn primary-btn my-2 my-sm-0">Logout</button>                
    );
}

export default LogoutButton;
