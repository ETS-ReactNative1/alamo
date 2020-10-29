import React from 'react';
import axios from 'axios';

import FriendCard from './FriendCard';

class FriendsList extends React.Component  {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <React.Fragment>
                <h3 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Friends</h3>
                <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Online - 4 Friends</h3>

                {this.props.friends.map((friend) => {
                    console.log(friend, 'this is the friend id')
                    return(
                        <FriendCard userId={friend}/>
                    )
                })}

                <h3 className="sidebar-subheading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 thin">Offline</h3>
                <FriendCard username={'nemix'} status={''} avatar={'bear'}/>
                <FriendCard username={'paddyg'} status={''} avatar={'sloth'}/>
            </React.Fragment>
        )
    }
}

export default FriendsList;
