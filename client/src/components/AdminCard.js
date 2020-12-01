import React from 'react';
import axios from 'axios';

class AdminCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                id: null,
                username: '',
                avatar: ''
            },
            online: false,
            status: ''
        }
    }

    handleContextClick = (event) => {
        event.preventDefault();
        const x_pos = event.pageX.toString() + 'px';
        const y_pos = event.pageY.toString() + 'px';
        const online = event.currentTarget.getAttribute('data-online');
        console.log(online)
        this.props.handleContextMenu(event.currentTarget.id, 'friend', x_pos, y_pos, online)
    }


    fetchUserInformation = async () => {
        axios.get('/user', {params: {userId: this.props.userId}})
            .then((response) => {
                this.setState({user: {id: response.data[0]._id, username: response.data[0].user_metadata.username, avatar: response.data[0].user_metadata.avatar}})
            })
            .catch((err) => console.log(err))
    }

    componentDidMount() {
        this.fetchUserInformation()
    }

    render() {
        return(
            <div id={this.props.userId} key={this.props.userId} data-online={this.state.online} className="row sidebar-friend align-items-center">
                <div className="col-3 friend-card-avatar">
                    {this.state.online ? <i className="fas fa-circle online"></i> : null }
                    <img className="user-avatar rounded-circle w-15" src={this.state.user.avatar} />
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col">
                            <h3 className="username bold">{this.state.user.username}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h6 className="user-status overflow-dots thin">{this.state.status}</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminCard;
