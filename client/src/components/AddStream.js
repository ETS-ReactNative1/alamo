import React from 'react';
import axios from 'axios';

import StreamCard from './StreamCard';
import AddStreamCard from './AddStreamCard';
import SearchBar from './SearchBar'


class AddStream extends React.Component {
    constructor(props) {
        super(props);

        this.state = {streams: [], game: '', showStreams: false, selected: '', searchBarStatus: false}
    }

    componentDidMount() {
        axios.get('/twitchapi/streams')
            .then((response) => {
                this.setState({streams: response.data, showStreams: true})
            })
            .catch((error) => console.log(error))
    }

    searchBarStatus = (status) => {
        this.setState({searchBarStatus: status})
    }

    render() {
        return(
            <div className="container-fluid room-showcase-container margin-top">
                <div className="row">
                    <div className="col" style={{maxWidth: '350px'}}>
                        {this.state.searchBarStatus ? <h3 className="more-stream-heading thin d-block">Add Stream</h3> : null }
                    </div>
                    <div className="col">
                        {!this.state.searchBarStatus ? <h3 className="more-stream-heading add-streams-heading-popular thin d-block">Some Popular Streams</h3> : null }
                    </div>
                </div>

                {(this.state.showStreams) ? 
                    <div className="row room-showcase-row" style={this.state.searchBarStatus ? {overflow: 'hidden'} : null}>
                            <AddStreamCard searchBarStatus={this.searchBarStatus} handleClick={this.props.handleClick} selected={this.props.selected}/>

                            <div className="col stream-border" style={{maxWidth: '2px'}}>
                                <h3 className="more-stream-heading thin d-block"></h3>
                            </div>

                            {this.state.streams.map((stream, index) => {
                                let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                                if (index <= 7) {
                                    return(
                                        <StreamCard key={index} gameId={this.props.gameId} handleClick={this.props.handleClick} selected={this.props.selected} admins={this.props.admins} stream={stream} image={image} changeStream={this.props.changeStream} type={'select'} vote={this.props.vote}/>
                                    )                                
                                }
                            })}
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default AddStream;
