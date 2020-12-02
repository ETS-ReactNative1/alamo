import React from 'react';
import axios from 'axios';

import InviterCard from './InviterCard';
import StreamCard from './InviteStreamCard';
import PollResults from './PollResults';

class InviteAlert extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            streamId: '',
            channelImage: '',
            stream: {}
        }
    }

    fetchRoomInformation = () => {
        axios.get('/room', {params: {roomId: this.props.roomId}})
            .then(response => {
                this.fetchStream(response.data.stream)
            })
    }

    fetchStream = (streamId) => {
        axios.get('/twitchapi/streams', {params : {user_id: streamId}})
            .then((response) => {
                let image = response.data[0].thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                this.setState({stream: response.data[0], channelImage: image})
            })
    }

    getUser = () => {
        axios.get('/user', {params: {userId: this.props.inviteeId}})
            .then((response) => {
                this.setState({invitee: response.data[0].user_metadata.username})
            })
    }

    componentDidMount() {
        this.fetchRoomInformation();
        this.getUser();
    }

    declineInvite = () => {
        this.props.declineVote();
    }

    render() {
        return(
            <div className="container invite-container">
                <div className="row">
                    <div className="col">
                        <InviterCard userId={this.props.inviterId} invitee={this.state.invitee} stream={this.state.stream.user_name}/>
                    </div>
                </div>                
                <div className="row">
                    <div className="col">
                        <StreamCard stream={this.state.stream} channelImage={this.state.channelImage}/>
                    </div>
                </div>
                <div className="row vote-actions-row relative d-flex justify-content-around" style={{height: '55px'}}>
                   <div className="col-4">
                        <i id="decline" className="fas fa-2x vote-icons fa-times-circle" style={{color: 'red'}} onClick={this.declineInvite}></i>
                    </div>
                    <div className="col-4">
                        <a href={this.props.roomId}>
                            <i id="accept" className="fas fa-2x vote-icons fa-check-circle" style={{color: 'green'}}></i>
                        </a>
                    </div>
                </div>
           </div>
        )
    }
}

export default InviteAlert;
