import React from 'react';

import ResultsCard from './ResultsCard';
import ChannelResults from './ChannelResults';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            channelIndex : 0
        }
    }

    viewMore = () => {
        this.setState({channelIndex: this.state.channelIndex+1})
    }

    render() {
        console.log(this.props.channels)
        return(
            <div className={this.props.loading === false ? "search-results-container" : "search-results-container hide-results" }>
                {this.props.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }

                {this.props.channels.length > 0 ?
                        this.props.channels.map((channel, index) => {
                            //Limit this to max 5 channels
                            if (index <= this.state.channelIndex && index <= 4)
                                return(
                                    <ChannelResults channels={channel}/>
                                )
                        }) 
                : null}
                {this.props.channels.length > 0 && this.state.channelIndex < 4 ? <div onClick={this.viewMore} className="view-more font-color thin">View More Channels</div> : null}

                {this.props.streamResults.map((stream) => {
                    return(
                        <ResultsCard loaded={this.props.loaded} stream={stream}/>
                    )
                })}
            </div>
        )
    }
};

export default SearchResults;
