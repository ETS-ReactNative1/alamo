import React from 'react';

import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';
import LogoutButton from './LogoutButton';

const NavigationBar = () => {
    return(
        <nav className="navbar">
            <MobileSidebarBtn/>
            <CreateRoomBtn/>
            <LogoutButton/>
        </nav>
    )
}

export default NavigationBar
