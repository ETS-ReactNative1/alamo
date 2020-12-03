import React from 'react';
import axios from 'axios';

class StreamCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            channelImage: '',
            thumbnailLoading: true,
            channelAvatarLoading: true,
            selected: '',
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
        if (this.props.type === 'room')
            this.setState({showOptions: true})
    }

    handleMouseLeave = () => {
        if (this.props.type === 'room')
            this.setState({showOptions: false})
    }


    streamCardOptions = (userId) => {
        if (this.state.showOptions && this.props.type === 'room') {
            return(
                <div className="stream-card-options">
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-6">
                            <i className={this.state.admins.includes(localStorage.getItem('userId')) ? "fas fa-3x stream-card-options-icons font-color fa-tv" : "fas fa-3x stream-card-options-icons font-color disabled fa-tv"} data-gameid={this.props.stream.game_id} data-channel={this.props.stream.user_name} data-userid={this.props.stream.user_id} data-image={this.props.image} data-channel-image={this.state.channelImage} data-stream-title={this.props.stream.title} data-username={this.props.stream.user_name} title="Change Stream" id={this.props.stream.user_id} onClick={this.props.changeStream}></i>
                        </div>
                        <div className="col-6">
                            <i className="fas fa-3x stream-card-options-icons font-color fa-poll" title="Vote" id={this.props.stream.user_id} data-userid={this.props.stream.user_id} data-image={this.props.image} data-gameid={this.props.stream.game_id} data-channel={this.props.stream.user_name} data-channel-image={this.state.channelImage} data-stream-title={this.props.stream.title} data-username={this.props.stream.user_name} onClick={this.props.vote}></i>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.props.selected === userId && this.props.type === 'select') {
            return(
                <div className="stream-card-options" style={{width: '100%', padding: '0', marginRight: '15px'}}>
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-12" style={{padding: '0', right: '20px'}}>
                            <i className="far stream-card-options-icons fa-4x fa-check-circle font-color"></i>
                        </div>
                    </div>
                </div>
            )

        }
    }

    render() {
        return(
            <div id={this.props.stream.user_id} className={this.props.small ? "col stream-card margin-right" : "col stream-card" } onClick={this.props.handleClick} onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
                {this.streamCardOptions(this.props.stream.user_id)}

                {this.state.thumbnailLoading ? <div style={{transform: 'scale(0.4) translate(-50%, -50%)', top: '35%', left: '45%'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}
                <img className="stream-card-image" src={this.props.image} alt={this.props.stream.title} onLoad={() => this.setState({thumbnailLoading: false})}/>


                {this.state.channelAvatarLoading ? <div style={{transform: 'scale(0.4)', top: '200px', left: '13px'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}
                <div className="stream-card-contents">                
                    <img className="stream-avatar rounded-circle" src={this.state.channelImage} onLoad={() => this.setState({channelAvatarLoading: false})}/>
                    <h6 className="stream-card-title">{this.props.stream.title}</h6>
                    <h6 className="stream-card-user">{this.props.stream.user_name}</h6>
                </div>

            </div>
        )
    }
}

export default StreamCard;
