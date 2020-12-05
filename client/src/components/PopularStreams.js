import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';

class PopularStreams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {streams: [], game: '', showStreams: false}
    }

    componentDidMount() {
        axios.get('/twitchapi/streams')
            .then((response) => {
                this.setState({streams: response.data, showStreams: true})
            })
            .catch((error) => console.log(error))
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
                                        type={'create'} 
                                        key={index} 
                                        gameId={this.props.gameId} 
                                        admins={this.props.admins} 
                                        stream={stream} 
                                        image={image} 
                                        changeStream={this.props.changeStream} 
                                        createRoomFromStream={this.props.createRoomFromStream}
                                        vote={this.props.vote}/>
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
