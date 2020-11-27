import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';

class MoreStreams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {streams: [], game: '', showStreams: false}
    }

    componentDidMount() {
        axios.get('/twitchapi/streams', {params: {game_id: this.props.gameId}})
            .then((response) => {
                this.setState({streams: response.data, game: response.data[0].game_name, showStreams: true})
            })
            .catch((error) => console.log(error))
    }

    render() {
        return(
            <div className="container-fluid more-streams-container">
                <div className="row">
                    <div className="col">
                        <h3 className="more-stream-heading thin d-block">More {this.state.game} Streams</h3>
                    </div>
                </div>

                {(this.state.showStreams) ? 
                    <div className="row">
                            {this.state.streams.map((stream, index) => {
                                let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                                return(
                                    <StreamCard key={index} admins={this.props.admins} stream={stream} image={image} changeStream={this.props.changeStream} vote={this.props.vote}/>
                                )
                            })}
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default MoreStreams;
