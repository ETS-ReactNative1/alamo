import React from 'react';
import { withRouter } from 'react-router-dom';

class AddRoomCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="col add-room-card" onClick={() => this.props.history.push('/create-room')}>
                <h4 className="add-stream-card-contents xyz thin">New Room</h4>
                <i class="far fa-4x fa-plus-square xyz add-stream-card-icon"></i>
            </div>
        )
    }
}

export default withRouter(AddRoomCard);
