import React from 'react';
import axios from 'axios';

class ResultsCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: ''
        }
    }

    componentDidMount() {
        if (this.props.stream)
            this.props.loaded();

        axios.get('/twitchapi/channels', {params: {channel: this.props.stream.user_name}})
            .then((response) => {
                this.setState({avatar: response.data[0].thumbnail_url})
            })
            .catch((error) => console.log(error))
    }

    createRoomFromStreamHandler = (event) => {
        this.props.createRoomFromStream(event);
        this.props.clear();
    }

    cardOptions = () => {
        if (this.props.activeRoom != null)
            return(
                <React.Fragment>
                    <i 
                        className="fas fa-2x results-icons primary-color fa-tv" 
                        title="Change Stream"
                        data-gameid={this.props.stream.game_id} 
                        data-channel={this.props.stream.user_name} 
                        data-userid={this.props.stream.user_id} 
                        data-image={this.props.image} 
                        data-avatar={this.state.avatar}
                        data-stream-title={this.props.stream.title} 
                        data-username={this.props.stream.user_name} 
                        id={this.props.stream.user_id} 
                        onClick={this.props.changeStream}
                    ></i>
                    <i 
                        className="fas fa-2x results-icons vote-icon primary-color fa-poll" 
                        title="Vote"
                        data-gameid={this.props.stream.game_id} 
                        data-channel={this.props.stream.user_name} 
                        data-userid={this.props.stream.user_id} 
                        data-image={this.props.image} 
                        data-avatar={this.state.avatar}
                        data-stream-title={this.props.stream.title} 
                        data-username={this.props.stream.user_name} 
                        id={this.props.stream.user_id} 
                        onClick={this.props.vote}
                    ></i>
                </React.Fragment>
            )
        else 
            return(
                <i 
                    className="fas fa-2x results-icons primary-color fa-plus-square"
                    style={{paddingRight: '25px'}}
                    data-gameid={this.props.stream.game_id} 
                    data-channel={this.props.stream.user_name} 
                    data-userid={this.props.stream.user_id} 
                    data-image={this.props.image} 
                    data-stream-title={this.props.stream.title} 
                    data-username={this.props.stream.user_name} 
                    title="Change Stream" id={this.props.stream.user_id} 
                    onClick={(event) => this.createRoomFromStreamHandler(event)}></i>
            )
    }

    render() {
        return(
            <div className="container-fluid d-flex stream-results-card">
                <div className="row align-items-center" style={{width: '100%'}}>
                    <div className="col-6">
                        <img className="stream-results-img" src={this.props.image} alt="" />
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h4 className="stream-result-title">{this.props.stream.title}</h4>
                                <h6 className="stream-result-username">{this.props.stream.user_name}</h6>
                            </div>
                        </div>
                        <div className="row">
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

export default ResultsCard;
