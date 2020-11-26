import React from 'react';

import ResultsCard from './ResultsCard';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="search-results-container">
                {this.props.results.map((stream) => {
                    return(
                        <ResultsCard stream={stream}/>
                    )
                })}
            </div>
        )
    }
};

export default SearchResults;
