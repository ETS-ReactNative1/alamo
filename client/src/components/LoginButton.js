import React, { Component } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => loginWithRedirect()} class="btn primary-btn my-2 my-sm-0">Login</button>                
    );
}

export default LoginButton;
