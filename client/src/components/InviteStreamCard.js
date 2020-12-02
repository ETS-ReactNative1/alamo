import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            thumbnailLoading: true,
            channelAvatarLoading: true,
        }

    }

    render() {
        return(
            <div id={this.props.stream._id} className="col invite-stream-card" style={{marginTop: '25px'}}>
                {this.state.thumbnailLoading ? <div style={{transform: 'scale(0.4) translate(-50%, -50%)', top: '35%', left: '45%'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}
                <img className="stream-card-image" src={this.props.channelImage} alt={this.props.stream.title} onLoad={() => this.setState({thumbnailLoading: false})}/>

                {this.state.channelAvatarLoading ? <div style={{transform: 'scale(0.4)', top: '200px', left: '13px'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}
                <img className="stream-avatar rounded-circle" src={this.props.channelImage} onLoad={() => this.setState({channelAvatarLoading: false})}/>
                <h6 className="stream-card-title">{this.props.stream.title}</h6>
                <h6 className="stream-card-user">{this.props.stream.user_name}</h6>
            </div>
        )
    }
}

export default StreamCard;
