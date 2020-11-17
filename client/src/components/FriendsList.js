import React from 'react';
import axios from 'axios';

import FriendCard from './FriendCard';

class FriendsList extends React.Component  {
    constructor(props) {
        super(props)

        this.state = {
            onlineFriends: [],
            no: 0
        }
    }

    initFriendsList = () => {
        if (this.props.friends.length === 0) {
            return(
                <h6 className="friends-initial-message">Share the moment with others by adding friends to your friends list.</h6>
            )
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.onlineUsers != prevProps.onlineUsers)
            this.numberOfFriends()
            console.log(this.props.onlineUsers, 'UPDATE FIRENDS')
    }

    componentDidMount() {
        this.numberOfFriends();
    }

    numberOfFriends = () => {
        let count = 0;
        Object.keys(this.props.onlineUsers).map((user) => {
            if (this.props.friends.includes(user, 0)) {
                count += 1
            }
            this.setState({no: count})
        })
    }

    render() {
        const friends = this.props.friends;
        return(
            <React.Fragment>
                <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Friends</h3>

                {friends.length > 0 ? <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Online - {this.state.no} Friends</h3> : null }

                {this.initFriendsList()}

                {friends.map((friend) => {
                    if ((friend in this.props.onlineUsers)) {
                        return(
                            <FriendCard key={friend} onlineUsers={this.props.onlineUsers} handleContextMenu={this.props.handleContextMenu} userId={friend}/>
                        )
                    }
                })}

                {friends.length > 0 ? <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3> : null }

                {friends.map((friend) => {
                    if (!(friend in this.props.onlineUsers))
                        return(
                            <FriendCard key={friend} onlineUsers={this.props.onlineUsers} handleContextMenu={this.props.handleContextMenu} userId={friend}/>
                        )
                })}

            </React.Fragment>
        )
    }
}

export default FriendsList;
