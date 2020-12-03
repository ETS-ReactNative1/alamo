import React from 'react';
import { withRouter } from 'react-router-dom'
import ProfileCard from './ProfileCard';
import RoomList from './RoomList';
import FriendsList from './FriendsList';
import SidebarFriendsControls from './SidebarFriendsControls';

class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {x_pos: '0px', show: false}
    }

    returnHome = () => {
        this.props.history.push('/');
    }

    handleTouchStart = (touchStartEvent) => {
        touchStartEvent.preventDefault();
    }

    handleTouchMove = (event) => {
        event.preventDefault();
        console.log(event.targetTouches[0].clientX - 294)
        let pos = (event.targetTouches[0].clientX - 294).toString() + 'px'
        if (event.targetTouches[0].clientX - 294 <= -195) {
            this.setState({x_pos: pos, show: true})
        } else {
            this.setState({x_pos: '0px', show: true})
        }
    }

    handleCloseTouchStart = (touchStartEvent) => {
        console.log(touchStartEvent)
    }

    handleCloseTouchMove = (event) => {
        console.log(event.targetTouches[0].clientX - 294)
        if (event.targetTouches[0].clientX - 294 <= 0) {
            this.setState({x_pos: '-299px', show: false})
        }
    }

    handleTouchEnd = (event) => {
        const last_pos = this.state.x_pos.substring(0, this.state.x_pos.length - 2)
        if (parseFloat(last_pos) < -195) {
            this.setState({x_pos: '-299px'})
        } else {
            this.setState({x_pos: '0px'})
        }
    }

    handleClick = (event) => {
        event.stopPropagation();
        this.props.closeContextMenu();
    }

    render() {
        const userId =  this.props.user._id;
        const username = this.props.user.user_metadata && this.props.user.user_metadata.username;
        const avatar = this.props.user.user_metadata && this.props.user.user_metadata.avatar;
        const pendingInvitation = this.props.user.pending_invitations;
        const friends = this.props.user.friends;
        const rooms = this.props.user.rooms;

        return(
            <React.Fragment>
                {this.state.show ? 
                    <div className="sidebar-close-trigger"
                        onTouchStart={this.handleCloseTouchStart}
                        onTouchMove={this.handleCloseTouchMove}
                        onTouchEnd={this.handleCloseTouchEnd}
                    ></div>
                    : null }
                <div
                    className="sidebar-trigger"
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                ></div>
                <nav className="col-md-2 d-md-block sidebar" 
                    style={this.props.openMenu ? {transform: 'translateX(0px)'} : !this.props.matches ? {transform: 'translateX(-299px)'} : this.state.show ? {transform: `translateX(${this.state.x_pos})`} : {transform: 'translateX(0px)'}}
                    onClick={this.handleClick}
                >

                    <div className="sidebar-sticky">
                        <div className="row">
                            <div className="col">
                                <h1 className="logo-main centered margin-bottom" onClick={this.returnHome}>alamo</h1>
                            </div>
                        </div>

                        <ProfileCard 
                            socket={this.props.socket}
                            userId={userId} 
                            username={username} 
                            status={'Watching Valorant...'} 
                            avatar={avatar} 
                            handleContextMenu={this.props.handleContextMenu}
                        />

                        { rooms ? 
                            <RoomList 
                                socket={this.props.socket}
                                activeRoom={this.props.activeRoom} 
                                showRoom={this.props.showRoom} 
                                changeRoom={this.props.changeRoom} 
                                rooms={rooms} 
                                closeMenu={this.props.closeMenu}
                                handleContextMenu={this.props.handleContextMenu} 
                            /> : null}

                        { friends ? 
                            <FriendsList 
                                socket={this.props.socket} 
                                friends={friends} 
                                onlineUsers={this.props.onlineUsers} 
                                handleContextMenu={this.props.handleContextMenu}
                            /> : null }

                    </div>
                </nav>

                    { pendingInvitation ? 
                        <SidebarFriendsControls 
                            matches={this.props.matches}
                            show={this.props.openMenu}
                            socket={this.props.socket} 
                            pendingInvitations={pendingInvitation} 
                            fetchUserInformation={this.props.fetchUserInformation}
                        /> : null }

            </React.Fragment>
        )
    }
}

export default withRouter(Sidebar);
