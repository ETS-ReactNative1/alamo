import React from 'react';

class ResultsCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.stream)
            this.props.loaded();
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
                        data-stream-title={this.props.stream.title} 
                        data-username={this.props.stream.user_name} 
                    ></i>
                    <i 
                        className="fas fa-2x results-icons vote-icon primary-color fa-poll" 
                        title="Vote"
                        data-gameid={this.props.stream.game_id} 
                        data-channel={this.props.stream.user_name} 
                        data-userid={this.props.stream.user_id} 
                        data-image={this.props.image} 
                        data-stream-title={this.props.stream.title} 
                        data-username={this.props.stream.user_name} 
                        id={this.props.stream.user_id} 
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
