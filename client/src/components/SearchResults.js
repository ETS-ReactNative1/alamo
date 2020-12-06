import React from 'react';
import axios from 'axios';

import ResultsCard from './ResultsCard';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

    }

    changeStream = (event) => {
        const streamId = event.currentTarget.id
        axios.post('/room/change-stream', {roomId: this.props.activeRoom, channel: streamId})
            .then((response) => {
                this.props.socket.emit('change-stream', this.props.activeRoom, streamId)
            })
            .catch((err) => console.log(err))
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
        console.log(this.props.channels)
        return(
            <div className={this.props.loading === false ? "search-results-container" : "search-results-container hide-results" }>
                {this.props.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }

                {this.props.streamResults.map((stream) => {
                    let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                    return(
                        <ResultsCard 
                            createRoomFromStream={this.props.createRoomFromStream}
                            loaded={this.props.loaded}
                            stream={stream}
                            image={image}
                            clear={this.props.clear}
                        />
                    )
                })}
            </div>
        )
    }
};

export default SearchResults;
