import React from 'react';
import axios from 'axios';

import HoverCard from './HoverCard';

class RoomUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            avatar: '',
            friendStatus: null,
            showCard: false,
            position: '',
            x: '',
            y: ''
        }
    }

    componentDidMount() {
        axios.get('/user', {params: {userId: this.props.userId}})
            .then(response => {
                console.log(this.props.userId, 'TGHIS IS WHAT IS BEING USE TO BE FETCHED')
                console.log(response)
                this.setState({username: response.data[0].user_metadata.username, avatar: response.data[0].user_metadata.avatar})
                console.log(this.state)

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
            this.setState({showCard: !this.state.showCard, position: 'bottom', x: event.clientX, y: event.clientY})
        } else {
            this.setState({showCard: !this.state.showCard, position: 'top', x: event.clientX, y: event.clientY})
        }
    }

    render() {
        return(
            <div className="col-1 room-avatar-col">
                {this.props.admins.includes(this.props.userId, 0) ? <i class="admin-icon fas fa-crown"></i> : null}
                <img onClick={this.handleClick} className={this.props.speakingPeers.includes(this.props.userId, 0) ? "room-avatar rounded-circle w-15 speaking" : "room-avatar rounded-circle w-15"} src={'/images/avatars/' + this.state.avatar + '-avatar.png'} />
                { this.state.showCard ? <HoverCard position={this.state.position} x={this.state.x} y={this.state.y} userId={this.props.userId} username={this.state.username} avatar={this.state.avatar} online={true} friendStatus={this.state.friendStatus}/> : null}
            </div>
        )
    }
}

export default RoomUser;
