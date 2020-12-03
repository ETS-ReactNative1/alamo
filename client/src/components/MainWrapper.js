import React from 'react';
import { withRouter } from 'react-router-dom';

class MainWrapper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {show: true}
    }

    componentDidMount() {
        if (window.location.pathname !== '/' ) this.setState({show: false})
        this.unlisten = this.props.history.listen((location, action) => {
            if (window.location.pathname !== '/' ) this.setState({show: false})
            else this.setState({show: true})
        });
    }

    render() {
        return(
            <div id="main-wrapper" className={this.state.show ? "main-wrapper" : "main-wrapper hide-main"} style={ this.props.openMenu ? {pointerEvents: 'none'} : {pointerEvents: 'auto'} }>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(MainWrapper);
