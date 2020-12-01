import React from 'react';

import SearchBox from './SearchBox';
import StreamCard from './StreamCard';

class AddStreamCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showSearch: false,
            results: [],
            searchResults: 7
        }
    }

    handleResults = (results) => {
        this.setState({results: results})
    }

    openSearch = () => {
        this.setState({showSearch: true})
        this.props.searchBarStatus(true)
    }

    closeSearch = (event) => {
        event.stopPropagation(); 
        this.props.searchBarStatus(false)
        this.setState({showSearch: false, results: []})
    }

    viewMore = () => {
        this.setState({searchResults: this.state.searchResults + 8})
    }
    
    render() {
        return(
            <React.Fragment>
                <div className={this.state.showSearch ? "add-stream-card search-full-width" : "add-stream-card"} onClick={this.openSearch}>
                    {this.state.showSearch ? <i className="fas fa-2x fa-times font-color" onClick={this.closeSearch} style={{position: 'absolute', top: '20px', right: '30px', zIndex: '99999'}}></i> : null }
                    {this.state.showSearch ? <SearchBox results={this.handleResults}/> : null}

                    {this.state.showSearch ?
                        <div className="row" style={{marginTop: '50px'}}>
                            {this.state.results.map((stream, index) => {
                                if (index <= this.state.searchResults) {
                                    let image = stream.thumbnail_url.replace('{width}', '347').replace('{height}', '195')
                                    return(
                                        <StreamCard type={'select'} key={index} handleClick={this.props.handleClick} selected={this.props.selected} gameId={this.props.gameId} admins={this.props.admins} stream={stream} image={image} changeStream={this.props.changeStream} vote={this.props.vote}/>
                                    )
                                }
                            })}
                        </div>
                    : null }
                    {this.state.results.length > 0 && this.state.searchResults <= this.state.results.length ? <div onClick={this.viewMore} className="view-more font-color thin">View More</div> : null}

                    {this.state.showSearch && this.state.results.length === 0 ? <h4 className="add-stream-card-contents thin">Don't be that guy, pick a stream everybody will enjoy</h4> : null }
                    {!this.state.showSearch ? <h4 className="add-stream-card-contents thin">Add Stream</h4> : null }
                    {!this.state.showSearch ? <i class="far fa-4x fa-plus-square add-stream-card-icon"></i> : null }
                </div>
            </React.Fragment>
        )
    }
}

export default AddStreamCard;
