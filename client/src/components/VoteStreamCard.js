import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log(this.props.stream)
    }

    render() {
        return(
            <div className="col stream-card-vote">
                <img className="stream-card-image" src={this.props.stream.thumbnail}/>
                <img className="stream-avatar rounded-circle" src={this.props.stream.avatar}/>
                <h6 className="stream-card-title">{this.props.stream.title}</h6>
                <h6 className="stream-card-user">{this.props.stream.channel}</h6>
            </div>
        )
    }
}

export default StreamCard;
