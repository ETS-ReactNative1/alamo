import React from 'react';

class ResultsCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.stream)
            this.props.loaded();
    }

    render() {
        const image = this.props.stream.thumbnail_url.replace('{width}', '120').replace('{height}', '67')
        return(
            <div className="container-fluid d-flex stream-results-card">
                <div className="row align-items-center" style={{width: '100%'}}>
                    <div className="col-5">
                        <img className="stream-results-img" src={image} alt="" />
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h4 className="stream-result-title">{this.props.stream.title}</h4>
                                <h6 className="stream-result-username">{this.props.stream.user_name}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <i className="fas fa-2x results-icons primary-color fa-tv" title="Change Stream"></i>
                                <i className="fas fa-2x results-icons vote-icon primary-color fa-poll" title="Vote"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResultsCard;
