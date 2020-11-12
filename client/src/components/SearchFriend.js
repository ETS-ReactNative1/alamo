import React from 'react';
import axios from 'axios';

import SearchFriendCard from './SearchFriendCard';

class SearchFriend extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            searchResults: []
        }
    }


    handleFriendSearch = (event) => {
        console.log('search user')
        event.preventDefault();
        let username = event.target.username.value;

        if (username != username.toLowerCase()) {
            username = username.toLowerCase();
        }

        axios.get('/user/search-friend', {params: {userId: localStorage.getItem('userId'), username: username}})
            .then(response => {
                if (response.data == null) {
                    this.setState({searchResults: [], userNotFound: 'No Friend Found.'})
                } else {
                    this.setState({searchResults: [response.data], userNotFound: ''})
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div className={(this.props.searchFriendActive) ? "col-12 friends-input-controls search-friends-active" : "col-12 friends-input-controls"} >
                <label id="friend-control-heading" htmlFor="username">Search Friend</label>
                {this.state.searchResults.map((friend) => {
                    console.log(friend)
                    return(
                        <SearchFriendCard userId={friend._id} username={friend.user_metadata.username} avatar={friend.user_metadata.avatar}/>
                    )
                })}
                <h6 id="friend-error-message">{this.state.userNotFound}</h6>
                <form action="post" onSubmit={this.handleFriendSearch}>
                    <input id="friend-control-input" placeholder="Username" name="username" autoFocus required minlength="3" />
                </form>
            </div>
        )
    }
}

export default SearchFriend;
