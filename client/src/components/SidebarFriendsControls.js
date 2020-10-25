import React from 'react';

const SidebarFriendsControls = () => {
    return(
        <div className="sidebar-friends-control-container">
            <div className="row align-items-center">
                <div className="col-6 sidebar-friend-control-col">
                    <i className="fas fa-1x font-color centered sidebar-friend-control-icon fa-user-plus"></i>
                </div>
                <div className="col-6 sidebar-friend-control-col">
                    <i style={{left: 'calc(50% - 10px)'}} className="fas fa-1x font-color centered sidebar-friend-control-icon fa-search"></i>
                </div>
            </div>
        </div>
    )
}

export default SidebarFriendsControls;
