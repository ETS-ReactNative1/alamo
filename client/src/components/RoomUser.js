import React from 'react';
import axios from 'axios';

import HoverCard from './HoverCard';

class RoomUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            showCard: false
        }
    }

    componentDidMount() {
        axios.get('/userId', {params: {userId: this.props.userId}})
            .then(response => {
                this.setState({user: response.data[0]})
            })
            .catch(err => console.log(err))
    }

    handleClick = () => {
        this.setState({showCard: !this.state.showCard})
    }

    render() {
        const username = this.state.user.user_metadata && this.state.user.user_metadata.username;
        const avatar = this.state.user.user_metadata && this.state.user.user_metadata.avatar;
        return(
            <React.Fragment>

                <img onClick={this.handleClick} className="room-avatar rounded-circle w-15" src={'/images/avatars/' + avatar + '-avatar.png'} />

                { this.state.showCard ? <HoverCard username={username} avatar={avatar} online={true}/> : null}

            </React.Fragment>
        )
    }
}

export default RoomUser;

