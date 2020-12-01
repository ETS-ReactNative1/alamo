import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import AddStreamCard from './AddStreamCard';
import Admins from './UpdateAdmins';

class EditRoom extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            admin: false,
            admins: [],
            room: []
        }
    }

    getRoomInformation = () =>  {
        axios.get('/room', {params: {roomId: window.location.pathname.substring(5)}})
            .then((response) => {
                this.setState({room: response.data, admins: response.data.admins})
                if (response.data.admins.includes(localStorage.getItem('userId'), 0)) {
                    this.setState({admin: true})
                    console.log(this.state.admins)
                }
            })
    }

    componentDidMount() {
        this.getRoomInformation();
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="setup-heading thin">Edit Room</h1>
                        <label htmlFor="roomName">Room Name</label>
                        {this.state.admin ? 
                            <input name="roomName" autoFocus required minlength="3" defaultValue={this.state.room.room_title}/>
                            :
                            <input name="roomName" autoFocus required minlength="3" placeholder={this.state.room.room_title} disabled/>
                        }

                        <label htmlFor="username">Stream</label>
                        <AddStreamCard/>


                        <Admins admins={this.state.admins} adminRights={this.state.admin}/>
                        <button className={this.state.admin ? "primary-btn setup-btn" : "primary-btn setup-btn disabled"} onClick={() => this.props.history.push('/')} style={{marginRight: '25px'}}>Save</button>
                        <button className="secondary-btn setup-btn" onClick={() => this.props.history.push('/')}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditRoom);
