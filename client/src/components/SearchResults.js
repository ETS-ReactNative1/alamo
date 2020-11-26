import React from 'react';

import ResultsCard from './ResultsCard';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className={this.props.loading === false ? "search-results-container" : "search-results-container hide-results" }>
                {this.props.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }

                {this.props.results.map((stream) => {
                    return(
                        <ResultsCard loaded={this.props.loaded} stream={stream}/>
                    )
                })}
            </div>
        )
    }
};

export default SearchResults;
