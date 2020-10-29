import React from 'react';
import ProfileCard from './ProfileCard';
import FriendsList from './FriendsList';
import SidebarFriendsControls from './SidebarFriendsControls';

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const userId =  this.props.user._id;
        const username = this.props.user.user_metadata && this.props.user.user_metadata.username;
        const avatar = this.props.user.user_metadata && this.props.user.user_metadata.avatar;
        const pendingInvitation = this.props.user.pending_invitations;
        const friends = this.props.user.friends;

        console.log(pendingInvitation, 'update ')
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

                    { friends ? <FriendsList friends={friends}/> : null }

                    { pendingInvitation ? <SidebarFriendsControls pendingInvitations={pendingInvitation}/> : null }

                </div>
            </nav>
        )
    }
}

export default Sidebar;
