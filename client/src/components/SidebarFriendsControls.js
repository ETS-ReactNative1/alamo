import React from 'react';

import AddFriend from './AddFriend';
import SearchFriend from './SearchFriend';

class SidebarFriendsControls extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            addFriend: false,
            searchFriend: false
        }
    }

    handleAddFriend = () => {
        this.setState({addFriend: !this.state.addFriend, searchFriend: false})
    }

    handleSearchFriend = () => {
        this.setState({searchFriend: !this.state.searchFriend, addFriend: false})
    }


    render() {
        return(
            <div className="sidebar-friends-control-container">
                <div className="row">
                    <AddFriend addFriendActive={this.state.addFriend}/>
                    <SearchFriend searchFriendActive={this.state.searchFriend}/>
                </div>
                <div className="row align-items-center">
                    <div className="col-6 sidebar-friend-control-col" onClick={this.handleAddFriend}>
                        <i class="fas fa-circle pending-notification"></i>
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
