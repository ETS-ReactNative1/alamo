import React from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';

class SearchBar extends React.Component {
    constructor(props) {
        super(props)

        this.searchInput = React.createRef();
        this.state = {
            query: '',
            loading: false,
            fullWidth: false,
            streamResults: [],
            channelResults: []
        }
    }

    searchTwitchChannel = (query) => {
        this.setState({loading: true})
        axios.get('/twitchapi/query-twitch', {params: {channel: query}})
            .then((response) => {
                this.setState({channelResults: response.data.channels, streamResults: response.data.streams, loading: false})
            })
            .catch((err) => console.log(err))
    }

    handleInputChange = (event) => {
        const query = event.target.value
        this.setState({query: query})
        
        if (this.state.query.length > 2) {
            this.searchTwitchChannel(query)
        }

        if (!this.props.matches) {
            this.setState({fullWidth: true})
            this.props.searchActive(true)
        }

        if (query.includes('twitch.tv/', 0)) {
            if (query.includes('https://', 0)) {
                const removeHTTPS = query.substring(query.indexOf('/')+2)
                const channel = removeHTTPS.substring(removeHTTPS.indexOf('/')+1)
                this.searchTwitchChannel(channel)
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
        this.setState({fullWidth: false, query: '', streamResults: [], channelResults: []})
        this.props.searchActive(false);
    }

    render() {
        return(
            <div className={this.state.fullWidth ? "main-search-box full-width-search" : "main-search-box" }>
                <input 
                    ref={this.searchInput}
                    className={this.state.query.length > 2 ? "main-search-input rm-bottom-border" : "main-search-input"} 
                    type="search-query" 
                    placeholder="Find Stream or paste Twitch url" 
                    onInput={this.handleInputChange}
                />
                {this.state.query.length > 2 ? <i className="fas fa-1x font-color search-bar-close fa-times" onClick={this.clear}></i> : null}
                {this.state.query.length > 2 ? <SearchResults activeRoom={this.props.activeRoom} socket={this.props.socket} loading={this.state.loading} loaded={this.loaded} channels={this.state.channelResults} streamResults={this.state.streamResults}/> : null}
            </div>
        )
    }
};

export default SearchBar;
