import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div id={this.props.stream._id} className="col invite-stream-card" style={{marginTop: '25px'}}>
                <img className="stream-card-image" src={this.props.channelImage} alt={this.props.stream.title}/>
                <img className="stream-avatar rounded-circle" src={this.props.channelImage}/>
                <h6 className="stream-card-title">{this.props.stream.title}</h6>
                <h6 className="stream-card-user">{this.props.stream.user_name}</h6>
            </div>
        )
    }
}

export default StreamCard;
