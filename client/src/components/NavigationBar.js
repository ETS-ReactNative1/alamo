import React from 'react';
import { withRouter } from 'react-router-dom';

import SearchBar from './SearchBar';
import MobileSidebarBtn from './MobileSidebarBtn';
import CreateRoomBtn from './CreateRoomBtn';

const NavigationBar = (props) => {
    const [burger, setBurger] = React.useState(false)
    const handleOpenMenu = (event) => {
        event.stopPropagation();
        props.openMenu();
    }

    const hideBurger = (status) => {
        setBurger(status)
    }
    return(
        <nav className="navbar">
            {!burger ? 
                <div className="burger-icon" onClick={(event) => handleOpenMenu(event)}>
                    <div className="burger"></div>
                    <div className="burger"></div>
                    <div className="burger"></div>
                </div>
                : null
            }
            <SearchBar 
                socket={props.socket} 
                closeSearch={props.closeSearch} 
                createRoomFromStream={props.createRoomFromStream}
                activeRoom={props.activeRoom} 
                searchActive={(status) => hideBurger(status)} 
                matches={props.matches}/>
            <CreateRoomBtn/>
        </nav>
    )
}

export default withRouter(NavigationBar);
