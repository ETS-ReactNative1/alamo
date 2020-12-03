import React from 'react';

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
        this.props.socket.on('pending-invitation', (senderId, receiverId) => {
            if (receiverId === localStorage.getItem('userId')) {
                this.setState({notification: true, senderId: senderId})
            }
        })

    }

    handleAddFriend = (event) => {
        event.stopPropagation();
        this.setState({addFriend: !this.state.addFriend, searchFriend: false})
    }

    handleSearchFriend = (event) => {
        event.stopPropagation();
        this.setState({searchFriend: !this.state.searchFriend, addFriend: false})
    }


    render() {
        return(
            <div className="sidebar-friends-control-container" style={this.props.show ? {transform: 'translate(0px)', position: 'fixed', bottom: '0', zIndex: '99999999999999999999999', maxWidth: '295px', borderRight: '0'} : this.props.matches ? {transform: 'translate(0px)'} : this.props.matches ? {maxWidth: '300px'} : {transform: 'translateX(-299px)'}}>
                <div className="row">
                    <AddFriend 
                        socket={this.props.socket} 
                        pendingInvitations={this.props.pendingInvitations} 
                        addFriendActive={this.state.addFriend} 
                        fetchUserInformation={this.props.fetchUserInformation}/>
                    <SearchFriend searchFriendActive={this.state.searchFriend}/>
                </div>
                <div className="row align-items-center">
                    <div className="col-6 sidebar-friend-control-col" onClick={this.handleAddFriend}>
                        <i className={(this.props.pendingInvitations.length > 0) ? "fas fa-circle pending-notification" : 'hide'}></i>
                        <i className="fas fa-1x font-color centered sidebar-friend-control-icon fa-user-plus"></i>
                    </div>
                    <div className="col-6 sidebar-friend-control-col" onClick={this.handleSearchFriend} style={this.props.show ? {maxWidth: '150px', borderRight: '0px'} : {maxWidth: '150px'}}>
                        <i style={{left: 'calc(50% - 10px)'}} className="fas fa-1x font-color centered sidebar-friend-control-icon fa-search"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default SidebarFriendsControls;
