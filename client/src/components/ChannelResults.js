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
        return(
            <div className="container-fluid channel-results-card d-flex align-items-center">
                <div className="row align-items-center">
                    <div className="col-5">
                        <img className="channel-results-img rounded-circle" src={this.props.channels[0].thumbnail_url} alt="" />
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h6 className="channel-font thin">Channel</h6>
                                <h4 className="channel-result-title">{this.props.channels[0].title}</h4>
                                <h6 className="channel-result-username thin">{this.props.channels[0].display_name}</h6>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-8">
                                {this.props.channels[0].is_live ? <div className="live">LIVE</div> : null}
                            </div>
                            <div className="col">
                                <i className="fas fa-2x results-icons primary-color fa-tv" title="Change Stream"></i>
                                <i className="fas fa-2x results-icons vote-icon primary-color fa-poll" title="Vote"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelResults;
