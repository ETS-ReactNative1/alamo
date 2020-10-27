import React from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client'
import { v4 as uuid } from 'uuid';
import axios from 'axios';

class CreateRoomBtn extends React.Component {

    redirect = (path) => {
        this.props.history.push('/create-room');
    }

    render() {
        return(
            <button className="primary-btn navbar-right" onClick={this.redirect}>
                <i class="fas fa-plus plus-create-btn"></i>
                Create
            </button>
        )
    }
}

export default withRouter(CreateRoomBtn);
