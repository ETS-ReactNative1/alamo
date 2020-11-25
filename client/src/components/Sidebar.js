import React from 'react';
import { withRouter } from 'react-router-dom'
import ProfileCard from './ProfileCard';
import RoomList from './RoomList';
import FriendsList from './FriendsList';
import SidebarFriendsControls from './SidebarFriendsControls';

class Sidebar extends React.Component {
    constructor(props) {
        super(props)
    }

    returnHome = () => {
        this.props.history.push('/');
    }

    render() {
        const userId =  this.props.user._id;
        const username = this.props.user.user_metadata && this.props.user.user_metadata.username;
        const avatar = this.props.user.user_metadata && this.props.user.user_metadata.avatar;
        const pendingInvitation = this.props.user.pending_invitations;
        const friends = this.props.user.friends;
        const rooms = this.props.user.rooms;

        return(
            <nav className="col-md-2 d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <div className="row">
                        <div className="col">
                            <h1 className="logo-main centered margin-bottom" onClick={this.returnHome}>alamo</h1>
                        </div>
                    </div>

                    <ProfileCard userId={userId} username={username} status={'Watching Valorant...'} avatar={avatar} handleContextMenu={this.props.handleContextMenu}/>

                    { rooms ? <RoomList activeRoom={this.props.activeRoom} showRoom={this.props.showRoom} changeRoom={this.props.changeRoom} rooms={rooms} handleContextMenu={this.props.handleContextMenu} /> : null}

                    { friends ? <FriendsList socket={this.props.socket} friends={friends} onlineUsers={this.props.onlineUsers} handleContextMenu={this.props.handleContextMenu}/> : null }

                    { pendingInvitation ? <SidebarFriendsControls socket={this.props.socket} pendingInvitations={pendingInvitation}/> : null }

                </div>
            </nav>
        )
    }
}

export default withRouter(Sidebar);
