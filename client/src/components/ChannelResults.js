import React from 'react';
import axios from 'axios';

class ChannelResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stream: {},
            thumbnailImage: ''
        }
    }

    componentDidMount() {
        if (this.props.stream)
            this.props.loaded();

        axios.get('/twitchapi/streams', {params: {user_id: this.props.channels.id}})
            .then((response) => {
                const image = response.data[0].thumbnail_url.replace('{width}', '120').replace('{height}', '67')
                this.setState({stream: response.data[0], thumbnailImage: image})
            })
            .catch((error) => console.log(error))

    }

    createRoomFromStreamHandler = (event) => {
        console.log(event.currentTarget.getAttribute('data-gameid'))
        this.props.createRoomFromStream(event);
        this.props.clear();
    }

    cardOptions = () => {
        if (this.props.activeRoom !== null) {
            return(
                <React.Fragment>
                    <i 
                        id={this.props.channels.id} 
                        onClick={this.props.changeStream} 
                        className={this.props.channels.is_live ? "fas fa-2x results-icons primary-color fa-tv" : "fas fa-2x results-cions disabled fa-tv"} 
                        title="Change Stream"
                        data-gameid={this.props.channels.id}
                        data-image={this.props.channels.thumbnail_url}
                        data-channel-image={this.props.channels.thumbnail_url}
                        data-stream-title={this.props.channels.title}
                    ></i>
                    <i 
                        id={this.props.channels.id} 
                        onClick={this.props.vote}
                        className={this.props.channels.is_live ? "fas fa-2x results-icons vote-icon primary-color fa-poll" : "fas fa-2x results-icons vote-icon disabled fa-poll"} 
                        title="Vote"
                        data-gameid={this.props.channels.id}
                        data-image={this.props.channels.thumbnail_url}
                        data-channel-image={this.props.channels.thumbnail_url}
                        data-stream-title={this.props.channels.title}
                    ></i>
                </React.Fragment>
            )
        } else {
            return(
                <i 
                    className="fas fa-2x results-icons primary-color fa-plus-square"
                    style={{paddingRight: '25px'}}
                    data-gameid={this.state.stream.game_id} 
                    data-channel={this.state.stream.user_name} 
                    data-userid={this.state.stream.user_id} 
                    data-image={this.state.thumbnailImage} 
                    data-stream-title={this.state.stream.title} 
                    data-username={this.state.stream.user_name} 
                    title="Change Stream" id={this.state.stream.user_id} 
                    onClick={(event) => this.createRoomFromStreamHandler(event)}></i>
            )
        }     
    }

    render() {
        return(
            <div className="container-fluid channel-results-card">
                <div className="row d-flex align-items-center" style={{height: '100%'}}>
                    <div className="col-sm-5 col-xs-2">
                        <img className="image-fluid px-4 w-100 rounded-circle" src={this.props.channels.thumbnail_url} alt="" />
                    </div>
                    <div className="col-md-7 col-sm-7">
                        <div className="row">
                            <div className="col">
                                {this.props.channels.is_live ? <div className="live">LIVE</div> : <div className="thin">Offline</div>}
                                <h6 className="channel-font thin">Channel</h6>
                                <h4 className="channel-result-title">{this.props.channels.title}</h4>
                                <h6 className="channel-result-username thin">{this.props.channels.display_name}</h6>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col">
                                {this.cardOptions()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelResults;
