import React from 'react';
import { withRouter } from 'react-router-dom';

import LogoutItem from './LogoutItem';

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    redirect = (path) => {
        this.props.history.push(path);
    }

    handleContextMenu = (id, x, y) => {
        console.log('context menu clicked dashboard at', id, x, y)
    }

    profileMenu = (show, x, y) => {
        return (
            <div className="container context-menu" style={{display: show, top: y, left: x}}>
                <div className="row">
                    <div className="col no-padding">

                        <ul className="nav flex-column font-color">
                            <li className="context-item">Update Status</li>
                            <li className="context-item" onClick={() => this.redirect('/update-avatar')}>Change Avatar</li>
                            <li className="context-item" onClick={() => this.redirect('/account-settings')}>Account Settings</li>
                            <LogoutItem/>
                        </ul>

                    </div>
                </div>
            </div>
        )
    }

    roomMenu = (show, x, y) => {
        return(
            <div className="container context-menu" style={{display: show, top: y, left: x}}>
                <div className="row">
                    <div className="col no-padding">

                        <ul className="nav flex-column font-color">
                            <li className="context-item">Join Room</li>
                            <li className="context-item">Edit Room</li>
                            <li className="context-item">Remove Room</li>
                        </ul>

                    </div>
                </div>
            </div>
        )
    }

    contextMenu = () => {
        const x = this.props.status && this.props.status.x;
        const y = this.props.status && this.props.status.y;
        const type = this.props.status && this.props.status.type

        if (type === 'profile') return this.profileMenu('block', x, y)
        if (type === 'room') return this.roomMenu('block', x, y)
    }

    render() {
        console.log(this.props.status)
        return(
            <React.Fragment>
                {this.contextMenu()}
            </React.Fragment>
        )
    }
}

export default withRouter(ContextMenu);
