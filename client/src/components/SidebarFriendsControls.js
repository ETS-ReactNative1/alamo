import React from 'react';
import io from 'socket.io-client';

import AddFriend from './AddFriend';
import SearchFriend from './SearchFriend';

class SidebarFriendsControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            addFriend: false,
            searchFriend: false,
            notification: false,
            senderId: '',
        }
    }

    componentDidMount() {
        const socket = io.connect('https://alamo-d19124355.herokuapp.com/')
        socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                this.setState({notification: true, senderId: senderId})
            }
        })

    }

    handleAddFriend = () => {
        this.setState({addFriend: !this.state.addFriend, searchFriend: false})
    }

    handleSearchFriend = () => {
        this.setState({searchFriend: !this.state.searchFriend, addFriend: false})
    }


    render() {
        console.log(this.props.pendingInvitations)
        return(
            <div className="sidebar-friends-control-container">
                <div className="row">
                    <AddFriend pendingInvitations={this.props.pendingInvitations} addFriendActive={this.state.addFriend}/>
                    <SearchFriend searchFriendActive={this.state.searchFriend}/>
                </div>
                <div className="row align-items-center">
                    <div className="col-6 sidebar-friend-control-col" onClick={this.handleAddFriend}>
                        <i className={(this.props.pendingInvitations.length > 0) ? "fas fa-circle pending-notification" : 'hide'}></i>
                        <i className="fas fa-1x font-color centered sidebar-friend-control-icon fa-user-plus"></i>
                    </div>
                    <div className="col-6 sidebar-friend-control-col" style={{maxWidth: '150px'}} onClick={this.handleSearchFriend}>
                        <i style={{left: 'calc(50% - 10px)'}} className="fas fa-1x font-color centered sidebar-friend-control-icon fa-search"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default SidebarFriendsControls;
