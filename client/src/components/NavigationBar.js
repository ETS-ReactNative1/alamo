import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchBar from './SearchBar';
import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';

const NavigationBar = (props) => {
    return(
        <nav className="navbar">
            {(props.location.pathname.substring(1, 5) === 'room') ? <i className="fas back-arrow font-color fa-2x fa-arrow-left" onClick={() => props.history.push('/')}></i>  : null} 
            {(props.location.pathname.substring(1, 7) === 'invite') ? <i className="fas back-arrow font-color fa-2x fa-arrow-left" onClick={() => props.history.push(props.activeRoom)}></i> : null}
            <SearchBar socket={props.socket} activeRoom={props.activeRoom}/>
            <MobileSidebarBtn/>
            <CreateRoomBtn/>
        </nav>
    )
}

export default withRouter(NavigationBar);
