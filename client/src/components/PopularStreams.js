import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';

class PopularStreams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streams: [], 
            game: '', 
            showStreams: false,
            cardType: 'create'
        }
    }

    componentDidMount() {
        axios.get('/twitchapi/streams')
            .then((response) => {
                this.setState({streams: response.data, showStreams: true})
            })
            .catch((error) => console.log(error))
    }

    vote = (event) => {
        const channelId = event.currentTarget.id;
        const channel = event.currentTarget.getAttribute('data-username')
        const gameId = event.currentTarget.getAttribute('data-gameid');
        const thumbnail = event.currentTarget.getAttribute('data-image');
        const avatar = event.currentTarget.getAttribute('data-avatar');
        const title = event.currentTarget.getAttribute('data-stream-title');
        const stream = {gameId : gameId, channelId: channelId, channel: channel, thumbnail: thumbnail, avatar: avatar, title: title};
        console.log(stream)

        this.props.socket.emit('start-vote', this.props.activeRoom, localStorage.getItem('userId'), stream)

        if (this.state.vote)
            alert('Vote already in progress')

        this.voteTimer = setTimeout(() => {
            this.props.socket.emit('finish-vote', this.props.activeRoom, 'failed')
        }, 1000 * 30)
    }


    render() {
        return(
            <div className="container-fluid popular-streams-container">
                <div className="row">
                    <div className="col">
                        <h3 className="more-stream-heading thin d-block">Popular Streams</h3>
                    </div>
                </div>

                {(this.state.showStreams) ? 
                    <div className="row more-streams-row">
                            {this.state.streams.map((stream, index) => {
                                let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                                return(
                                    <StreamCard 
                                        type={this.props.cardType} 
                                        key={index} 
                                        gameId={this.props.gameId} 
                                        admins={this.props.admins} 
                                        stream={stream} 
                                        image={image} 
                                        changeStream={this.props.changeStream} 
                                        createRoomFromStream={this.props.createRoomFromStream}
                                        vote={this.vote}/>
                                )                                
                            })}
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default PopularStreams;
