import React from 'react';

class ChannelResults extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.stream)
            this.props.loaded();
    }

    render() {
        console.log(this.props.channels)
        return(
            <div className="container-fluid channel-results-card d-flex align-items-center">
                <div className="row d-flex align-items-center" style={{height: '100%'}}>
                    <div className="col-5 channel-results-col-img">
                        <img className="channel-results-img rounded-circle" src={this.props.channels.thumbnail_url} alt="" />
                    </div>
                    <div className="col channel-results-col-content">
                        <div className="row">
                            <div className="col">
                                <h6 className="channel-font thin">Channel</h6>
                                <h4 className="channel-result-title">{this.props.channels.title}</h4>
                                <h6 className="channel-result-username thin">{this.props.channels.display_name}</h6>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-5">
                                {this.props.channels.is_live ? <div className="live">LIVE</div> : <div className="thin">Offline</div>}
                            </div>
                            <div className="col">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelResults;
