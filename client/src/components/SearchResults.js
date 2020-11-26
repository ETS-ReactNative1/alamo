import React from 'react';

import ResultsCard from './ResultsCard';
import ChannelResults from './ChannelResults';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props.channels)
        return(
            <div className={this.props.loading === false ? "search-results-container" : "search-results-container hide-results" }>
                {this.props.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }

                {this.props.channels.length > 0 ? <ChannelResults channels={this.props.channels}/> : null}
                <div className="view-more font-color thin">View More Channels</div>

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
