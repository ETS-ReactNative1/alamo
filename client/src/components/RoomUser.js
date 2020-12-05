import React from 'react';
import axios from 'axios';

class RoomUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            username: '',
            avatar: '',
            friendStatus: null,
            position: '',
            x: '',
            y: ''
        }
    }

    fetchUserInformation = () => {
        axios.get('/user', {params: {userId: this.props.userId}})
            .then(response => {
                this.setState({username: response.data[0].user_metadata.username, avatar: response.data[0].user_metadata.avatar})

                axios.get('/check-friend-status', {params: {searcherId: localStorage.getItem('userId'), recipentId: this.props.userId}})
                    .then(friendStatus => {
                        this.setState({friendStatus: friendStatus.data.friendStatus})
                    })
            })
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId)
            this.fetchUserInformation();
    }

    componentDidMount() {
        this.fetchUserInformation();
    }

    render() {
        return(
            <div data-userid={this.props.userId} className="col-1 room-avatar-col">

                {this.state.loading ? <div style={{transform: 'scale(0.4)', top: '4px', left: '3px'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}

                {this.props.admins.includes(this.props.userId, 0) ? <i className="admin-icon fas fa-crown"></i> : null}

                <img onClick={this.handleClick} className={this.props.speakingPeers.includes(this.props.userId, 0) ? "room-avatar rounded-circle w-15 speaking" : "room-avatar rounded-circle w-15"} src={this.state.avatar} onLoad={() => this.setState({loading: false})} />
            </div>
        )
    }
}

export default RoomUser;
