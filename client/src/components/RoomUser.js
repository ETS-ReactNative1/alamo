import React from 'react';
import axios from 'axios';

import HoverCard from './HoverCard';

class RoomUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            friendStatus: null,
            showCard: false,
            position: ''
        }
    }

    componentDidMount() {
        axios.get('/userId', {params: {userId: this.props.userId}})
            .then(response => {
                this.setState({user: response.data[0]})

                axios.get('/check-friend-status', {params: {searcherId: localStorage.getItem('userId'), recipentId: this.props.userId}})
                    .then(friendStatus => {
                        this.setState({friendStatus: friendStatus.data.friendStatus})
                    })
            })
            .catch(err => console.log(err))
    }

    handleClick = (event) => {
        //Change position of hover card if window height is reduced
        if ((window.innerHeight - event.clientY) < 300) {
            this.setState({showCard: !this.state.showCard, position: 'bottom'})
        } else {
            this.setState({showCard: !this.state.showCard, position: 'top'})
        }
    }

    render() {
        const username = this.state.user.user_metadata && this.state.user.user_metadata.username;
        const avatar = this.state.user.user_metadata && this.state.user.user_metadata.avatar;
        return(
            <div className="col-1 room-avatar-col">
                <img onClick={this.handleClick} className="room-avatar rounded-circle w-15" src={'/images/avatars/' + avatar + '-avatar.png'} />
                { this.state.showCard ? <HoverCard position={this.state.position} userId={this.props.userId} username={username} avatar={avatar} online={true} friendStatus={this.state.friendStatus}/> : null}
            </div>
        )
    }
}

export default RoomUser;
