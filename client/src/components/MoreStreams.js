import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';

class MoreStreams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {streams: []}
    }

    componentDidMount() {
        axios.get('/twitchapi/streams', {params: {search: 'csgo'}})
            .then((response) => {
                this.setState({streams: response.data})
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
                
                <div className="row">
                        {this.state.streams.map((stream) => {
                            let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                            return(
                                <StreamCard stream={stream} image={image}/>
                            )
                        })}
                </div>
            </div>
        )
    }
}

export default MoreStreams;
