import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            channelImage: '',
            showOptions: false,
            admins: []
        }
    }

    componentDidMount() {
        this.setState({admins: this.props.admins})
        axios.get('/twitchapi/channels/', {params: {channel: this.props.stream.user_name}})
            .then((response) => {
                this.setState({channelImage: response.data[0].thumbnail_url})
            })
            .catch((err) => console.log(err))
    }

    handleMouseOver = () => {
        this.setState({showOptions: true})
    }

    handleMouseLeave = () => {
        this.setState({showOptions: false})
    }

    streamCardOptions = () => {
        if (this.state.showOptions)
            return(
                <div className="stream-card-options">
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-6">
                            <i className={this.state.admins.includes(localStorage.getItem('userId')) ? "fas fa-3x stream-card-options-icons font-color fa-tv" : "fas fa-3x stream-card-options-icons font-color disabled fa-tv"} data-image={this.props.image} data-channelImage={this.state.channelImage} data-streamTitle={this.props.stream.title} data-username={this.props.stream.user_name} title="Change Stream" id={this.props.stream.user_name} onClick={this.props.changeStream}></i>
                        </div>
                        <div className="col-6">
                            <i className="fas fa-3x stream-card-options-icons font-color fa-poll" title="Vote" id={this.props.stream.user_name} data-image={this.props.image} data-channelImage={this.state.channelImage} data-streamTitle={this.props.stream.title} data-username={this.props.stream.user_name} onClick={this.props.vote}></i>
                        </div>
                    </div>
                </div>
            )
    }

    render() {
        return(
            <div id={this.props.stream.user_name} className="col stream-card" onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
                {this.streamCardOptions()}
                <img className="stream-card-image" src={this.props.image} alt={this.props.stream.title}/>
                <img className="stream-avatar rounded-circle" src={this.state.channelImage}/>
                <h6 className="stream-card-title">{this.props.stream.title}</h6>
                <h6 className="stream-card-user">{this.props.stream.user_name}</h6>
            </div>
        )
    }
}

export default StreamCard;
