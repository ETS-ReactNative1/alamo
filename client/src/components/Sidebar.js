import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = () => {

    const { user } = useAuth0();

    return(
        <nav class="col-md-2 d-none d-md-block sidebar">
            <div class="sidebar-sticky">
                <div className="row">
                    <div className="col">
                        <h1 className="logo-main centered margin-bottom">alamo</h1>
                    </div>
                </div>

                <div className="row sidebar-profile align-items-center">
                    <div className="col-3">
                        <img className="user-avatar rounded-circle w-15" src="/images/avatars/batman-avatar.png" alt={user.name} />
                    </div>
                    <div className="col-9">
                        <div className="row">
                            <div className="col">
                                <h3 className="username bold">M1llE7</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h6 className="user-status thin">Watching Valorant...</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Rooms</h3>
                <ul className="nav flex-column">
                    <li className="nav-item">CSGO - ELEAGUE FINAL WOOOO!!</li>
                    <li className="nav-item">Valorant Scrims</li>
                    <li className="nav-item">Millers Room</li>
                    <li className="nav-item">OWL LETS GO!!!</li>
                    <li className="nav-item">Dev1ce fan club</li>
                </ul>

                <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Friends</h3>
                <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Online - 4 Friends</h3>
                <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3>
            </div>
        </nav>
    )
}

export default Sidebar;
