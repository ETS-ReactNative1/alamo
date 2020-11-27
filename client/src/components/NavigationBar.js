import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchBar from './SearchBar';
import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';

const NavigationBar = (props) => {
    return(
        <nav className="navbar">
            <i className={(props.location.pathname.substring(1, 5) === 'room') ? "fas font-color fa-2x fa-arrow-left" : null} onClick={() => props.history.push('/')}></i>
            <SearchBar socket={props.socket} activeRoom={props.activeRoom}/>
            <MobileSidebarBtn/>
            <CreateRoomBtn/>
        </nav>
    )
}

export default withRouter(NavigationBar);
