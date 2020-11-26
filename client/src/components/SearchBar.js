import React from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';

class SearchBar extends React.Component {
    constructor(props) {
        super(props)

        this.searchInput = React.createRef();
        this.state = {
            query: '',
            results: []
        }
    }

    searchTwitch = (query) => {
        console.log('FETCH FEYHNTCH')
        axios.get('/twitchapi/streams', {params: {search: query}})
            .then((response) => {
                this.setState({results: []})
                this.setState({results: response.data})
                console.log(this.state.results)
            })
            .catch((err) => console.log(err))
    }

    handleInputChange = (event) => {
        const query = event.target.value
        this.setState({query: query})
        
        if (this.state.query.length > 2)
            this.searchTwitch(query)

        if (query.includes('twitch.tv/', 0)) {
            if (query.includes('https://', 0)) {
                const removeHTTPS = query.substring(query.indexOf('/')+2)
                const channel = removeHTTPS.substring(removeHTTPS.indexOf('/')+1)
                this.searchTwitch(channel)
            } else {
                const channel = query.substring(query.indexOf('/')+1)
                this.searchTwitch(channel)
            }
        }
    }

    clear = () => {
        this.searchInput.current.value = '';
        this.setState({query: '', results: []})
    }

    render() {
        return(
            <div className="main-search-box">
                <input 
                    ref={this.searchInput}
                    className={this.state.query.length > 2 ? "main-search-input rm-bottom-border" : "main-search-input"} 
                    type="search-query" 
                    placeholder="Find Stream or paste Twitch url" 
                    onInput={this.handleInputChange}
                />
                {this.state.query.length > 2 ? <i className="fas fa-1x font-color search-bar-close fa-times" onClick={this.clear}></i> : null}
                {this.state.query.length > 2 ? <SearchResults results={this.state.results}/> : null}
            </div>
        )
    }
};

export default SearchBar;
