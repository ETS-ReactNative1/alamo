import React from 'react';

import VoterCard from './VoterCard';
import StreamCard from './VoteStreamCard';
import PollResults from './PollResults';

class Vote extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="container vote-container">
                <div className="row">
                    <div className="col">
                        <VoterCard userId={this.props.userId} stream={this.props.stream.channel}/>
                    </div>
                </div>                
                <div className="row">
                    <div className="col">
                        <StreamCard stream={this.props.stream}/>
                    </div>
                </div>
                <div className="row relative d-flex justify-content-around" style={{height: '55px'}}>
                   <div className="col-4">
                        <i id="no" className={this.props.voterId === localStorage.getItem('userId') ? "fas fa-2x vote-icons fa-thumbs-down disabled" : "fas fa-2x vote-icons fa-thumbs-down disabled"} style={{color: 'red'}} onClick={this.props.votingActions}></i>
                        <h6 className="vote-nums thin">{this.props.noVotes}</h6>
                    </div>
                    <div className="col-4">
                        <i id="yes" className={this.props.voterId === localStorage.getItem('userId') ? "fas fa-2x vote-icons fa-thumbs-up disabled" : "fas fa-2x vote-icons fa-thumbs-up"} style={{color: 'green'}} onClick={this.props.votingActions}></i>
                        <h6 className="vote-nums thin">{this.props.yesVotes} / {this.props.votesNeeded}</h6>
                    </div>
                </div>
                <PollResults/>
           </div>
        )
    }
}

export default Vote;
