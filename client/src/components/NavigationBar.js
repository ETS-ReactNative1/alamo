import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchBar from './SearchBar';
import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';

const NavigationBar = (props) => {
    const handleOpenMenu = (event) => {
        event.stopPropagation();
        props.openMenu();
    }
    return(
        <nav className="navbar">
            <div className="burger-icon" onClick={(event) => handleOpenMenu(event)}>
                <div className="burger"></div>
                <div className="burger"></div>
                <div className="burger"></div>
            </div>
            <SearchBar socket={props.socket} activeRoom={props.activeRoom}/>
            <CreateRoomBtn/>
        </nav>
    )
}

export default withRouter(NavigationBar);
