import React from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';

class SearchBox extends React.Component {
    constructor(props) {
        super(props)

        this.searchInput = React.createRef();
        this.state = {
            query: '',
            loading: false,
            streamResults: [],
            channelResults: []
        }
    }

    searchTwitchChannel = (query) => {
        this.setState({loading: true})
        axios.get('/twitchapi/query-twitch', {params: {channel: query}})
            .then((response) => {
                this.props.results(response.data.streams)
            })
            .catch((err) => console.log(err))
    }

    handleInputChange = (event) => {
        const query = event.target.value
        this.setState({query: query})
        
        if (this.state.query.length > 2) {
            this.searchTwitchChannel(query)
        }

        if (query.includes('twitch.tv/', 0)) {
            if (query.includes('https://', 0)) {
                const removeHTTPS = query.substring(query.indexOf('/')+2)
                const channel = removeHTTPS.substring(removeHTTPS.indexOf('/')+1)
            } else {
                const channel = query.substring(query.indexOf('/')+1)
                this.searchTwitchChannel(channel)
            }
        }
    }

    loaded = () => {
        this.setState({loading: false});
    }

    clear = () => {
        this.searchInput.current.value = '';
        this.setState({query: '', streamResults: [], channelResults: []})
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
            </div>
        )
    }
};

export default SearchBox;
