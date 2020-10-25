import React from 'react';

import FriendCard from './FriendCard';

const SearchFriend = (props) => {
    return (
        <div className={(props.searchFriendActive) ? "col-12 friends-input-controls search-friends-active" : "col-12 friends-input-controls"} >
            <label id="friend-control-heading" htmlFor="username">Search Friend</label>
            <FriendCard username={'JonnyMul96'} status={'Watching Valorant...'} avatar={'afro'}/>
            <form action="post">
                <input id="friend-control-input" placeholder="Username" name="username" autoFocus required minlength="3" />
            </form>
        </div>
    )
}

export default SearchFriend;
