import React from 'react';
import axios from 'axios';

import ResultsCard from './ResultsCard';
import ChannelResults from './ChannelResults';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            channelIndex : 0
        }
    }

    viewMore = () => {
        this.setState({channelIndex: this.state.channelIndex+1})
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
        const channel = event.currentTarget.id;
        const gameId = event.currentTarget.getAttribute('data-gameid');
        const thumbnail = event.currentTarget.getAttribute('data-image');
        const avatar = event.currentTarget.getAttribute('data-channel-image');
        const title = event.currentTarget.getAttribute('data-stream-title');
        const stream = {gameId : gameId, channel: channel, thumbnail: thumbnail, avatar: avatar, title: title};

        if (!this.state.vote) 
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

                {this.props.channels.length > 0 ?
                        this.props.channels.map((channel, index) => {
                            //Limit this to max 5 channels
                            if (index <= this.state.channelIndex && index <= 4)
                                return(
                                    <ChannelResults activeRoom={this.props.activeRoom} channels={channel} changeStream={this.changeStream} vote={this.vote}/>
                                )
                        }) 
                : null}
                {this.props.channels.length > 0 && this.state.channelIndex < 4 ? <div onClick={this.viewMore} className="view-more font-color thin">View More Channels</div> : null}

                {this.props.streamResults.map((stream) => {
                    const image = stream.thumbnail_url.replace('{width}', '120').replace('{height}', '67')
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
