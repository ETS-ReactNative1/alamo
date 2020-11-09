import React from 'react';

import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';

const NavigationBar = () => {
    return(
        <nav className="navbar">
            <MobileSidebarBtn/>
            <CreateRoomBtn/>
        </nav>
    )
}

export default NavigationBar
