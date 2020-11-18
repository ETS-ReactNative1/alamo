import React from 'react';

import VoterCard from './VoterCard';
import StreamCard from './VoteStreamCard';

class Vote extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        console.log(this.props.userId)
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
                <div className="row relative" style={{height: '55px'}}>
                    <div className="col-6">
                        <i class="fas fa-2x vote-icons fa-thumbs-down" style={{color: 'red'}} onClick={this.props.voteNo}></i>
                    </div>
                    <div className="col-6">
                        <i class="fas fa-2x vote-icons fa-thumbs-up" style={{color: 'green'}} onClick={this.props.voteYes}></i>
                    </div>
                </div>
           </div>
        )
    }
}

export default Vote;
