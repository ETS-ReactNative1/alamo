import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            channelImage: ''
        }
    }

    componentDidMount() {
        axios.get('/twitchapi/channels/', {params: {channel: this.props.stream.user_name}})
            .then((response) => {
                this.setState({channelImage: response.data[0].thumbnail_url})
            })
            .catch((err) => console.log(err))
    }

    render() {
        return(
            <div className="col-3 stream-card">
                <img className="stream-card-image" src={this.props.image} alt={this.props.stream.title}/>
                <img className="stream-avatar rounded-circle" src={this.state.channelImage}/>
                <h6 className="stream-card-title">{this.props.stream.title}</h6>
                <h6 className="stream-card-user">{this.props.stream.user_name}</h6>
            </div>
        )
    }
}

export default StreamCard;
