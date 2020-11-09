import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutItem = () => {
    const { logout } = useAuth0();

    return (
        <li onClick={() => logout({ returnTo: window.location.origin })} className="context-item">Logout</li>
    );
}

export default LogoutItem;
