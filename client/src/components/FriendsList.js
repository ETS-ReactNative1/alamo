import React from 'react';
import axios from 'axios';

import FriendCard from './FriendCard';

class FriendsList extends React.Component  {
    constructor(props) {
        super(props)

        this.state = {
            onlineFriends: []
        }
    }

    initFriendsList = () => {
        if (this.props.friends.length === 0) {
            return(
                <h6 className="friends-initial-message">Share the moment with others by adding friends to your friends list.</h6>
            )
        }
    }

    render() {
        const friends = this.props.friends;
        return(
            <React.Fragment>
                <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Friends</h3>

                {friends.length > 0 ? <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Online - 4 Friends</h3> : null }

                {this.initFriendsList()}

                {friends.map((friend) => {
                    console.log(friend, 'this is the friend id')
                    return(
                        <FriendCard onlineUsers={this.props.onlineUsers} userId={friend}/>
                    )
                })}

                {friends.length > 0 ? <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3> : null }

            </React.Fragment>
        )
    }
}

export default FriendsList;
