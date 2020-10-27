import React from 'react';

import CreateRoomBtn from './CreateRoomBtn';
import LogoutButton from './LogoutButton';

const NavigationBar = () => {
    return(
        <nav className="navbar">
            <CreateRoomBtn/>
            <LogoutButton/>
        </nav>
    )
}

export default NavigationBar
