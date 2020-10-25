import React from 'react';

const AddFriend = (props) => {
    return (
        <div className={(props.addFriendActive) ? "col-12 friends-input-controls add-friends-active" : "col-12 friends-input-controls"} >
            <form action="post">
                <label id="friend-control-heading" htmlFor="username">Add Friend</label>
                <input id="friend-control-input" placeholder="Username" name="username" autoFocus required minlength="3" />
            </form>
        </div>
    )
}

export default AddFriend;
