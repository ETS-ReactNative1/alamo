import React from 'react';
import ProfileCard from './ProfileCard';
import FriendCard from './FriendCard';
import SidebarFriendsControls from './SidebarFriendsControls';

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const userId =  this.props.user._id;
        const username = this.props.user.user_metadata && this.props.user.user_metadata.username;
        const avatar = this.props.user.user_metadata && this.props.user.user_metadata.avatar;
        const pendingInvitations = this.props.user.pending_invitations;
        console.log(pendingInvitations)

        return(
            <nav className="col-md-2 d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <div className="row">
                        <div className="col">
                            <h1 className="logo-main centered margin-bottom">alamo</h1>
                        </div>
                    </div>

                    <ProfileCard userId={userId} username={username} status={'Watching Valorant...'} avatar={avatar}/>

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

                    <FriendCard username={'JonnyMul96'} status={'Watching Valorant...'} avatar={'afro'}/>
                    <FriendCard username={'TheKraken'} status={'Watching Valorant...'} avatar={'chaplin'}/>
                    <FriendCard username={'Mickmgs1337'} status={'Watching Valorant...'} avatar={'sheep'}/>
                    <FriendCard username={'RockieePower'} status={'Watching Valorant...'} avatar={'wrestler'}/>
                    <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3>
                    <FriendCard username={'nemix'} status={''} avatar={'bear'}/>
                    <FriendCard username={'paddyg'} status={''} avatar={'sloth'}/>

                    <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3>
                    <SidebarFriendsControls pendingInvitations={pendingInvitations}/>
                </div>
            </nav>
        )
    }
}

export default Sidebar;
