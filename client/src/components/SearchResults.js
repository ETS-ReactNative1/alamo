import React from 'react';
import axios from 'axios';

import ResultsCard from './ResultsCard';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

    }

    changeStream = (event) => {
        const streamId = event.currentTarget.id
        console.log('change stream!!!!!!!!!', streamId)
        axios.post('/room/change-stream', {roomId: this.props.activeRoom, channel: streamId})
            .then((response) => {
                this.props.socket.emit('change-stream', this.props.activeRoom, streamId)
            })
            .catch((err) => console.log(err))
    }

    vote = (event) => {
        console.log('vote')
        const channelId = event.currentTarget.id;
        const channel = event.currentTarget.getAttribute('data-username')
        const gameId = event.currentTarget.getAttribute('data-gameid');
        const thumbnail = event.currentTarget.getAttribute('data-image');
        const avatar = event.currentTarget.getAttribute('data-avatar');
        const title = event.currentTarget.getAttribute('data-stream-title');
        const stream = {gameId : gameId, channelId: channelId, channel: channel, thumbnail: thumbnail, avatar: avatar, title: title};
        console.log(stream)

        this.props.socket.emit('start-vote', this.props.activeRoom, localStorage.getItem('userId'), stream)

        this.voteTimer = setTimeout(() => {
            this.props.socket.emit('finish-vote', this.props.activeRoom, 'failed')
        }, 1000 * 30)
    }

    render() {
        console.log(this.props.channels)
        return(
            <div className={this.props.loading === false ? "search-results-container" : "search-results-container hide-results" }>
                {this.props.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }

                {this.props.streamResults.map((stream) => {
                    let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                    return(
                        <ResultsCard 
                            createRoomFromStream={this.props.createRoomFromStream}
                            activeRoom={this.props.activeRoom}
                            loaded={this.props.loaded}
                            stream={stream}
                            image={image}
                            vote={this.vote}
                            changeStream={this.changeStream}
                            clear={this.props.clear}
                        />
                    )
                })}
            </div>
        )
    }
};

export default SearchResults;
