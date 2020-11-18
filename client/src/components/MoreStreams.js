import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';

class MoreStreams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {streams: [], showStreams: false}
    }

    componentDidMount() {
        axios.get('/twitchapi/streams', {params: {search: 'csgo'}})
            .then((response) => {
                this.setState({streams: response.data, showStreams: true})
            })
            .catch((error) => console.log(error))
    }

    render() {
        return(
            <div className="container-fluid more-streams-container">
                <div className="row">
                    <div className="col">
                        <h3 className="more-stream-heading thin d-block">More Streams</h3>
                    </div>
                </div>

                {(this.state.showStreams) ? 
                    <div className="row">
                            {this.state.streams.map((stream) => {
                                let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                                return(
                                    <StreamCard admins={this.props.admins} stream={stream} image={image} changeStream={this.props.changeStream} vote={this.props.vote}/>
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
