import React from 'react';
import ProfileCard from './ProfileCard';
import RoomList from './RoomList';
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
        const rooms = this.props.user.rooms;

        console.log(rooms)
        return(
            <nav className="col-md-2 d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <div className="row">
                        <div className="col">
                            <h1 className="logo-main centered margin-bottom">alamo</h1>
                        </div>
                    </div>

                    <ProfileCard userId={userId} username={username} status={'Watching Valorant...'} avatar={avatar}/>

                    { rooms ? <RoomList rooms={rooms}/> : null}

                    { friends ? <FriendsList friends={friends}/> : null }

                    { pendingInvitation ? <SidebarFriendsControls pendingInvitations={pendingInvitation}/> : null }

                </div>
            </nav>
        )
    }
}

export default Sidebar;
