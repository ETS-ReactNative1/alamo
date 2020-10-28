import React from 'react';
import axios from 'axios';

class PendingFriend extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            username: '',
            avatar: ''
        }

    }

    componentDidMount() {
        axios.get('/userId', {params: {userId: this.props.userPendingInvitation}})
            .then(response => {
                console.log(response)
                this.setState({username: response.data[0].user_metadata.username, avatar: response.data[0].user_metadata.avatar})
            })
    }

    render() {
        return(
            <div id={this.props.userPendingInvitation} className="row sidebar-friend align-items-center">
                <div className="col-3">
                    <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + this.state.avatar + '-avatar.png'} />
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col">
                            <h3 className="username bold">{this.state.username}</h3>
                        </div>
                    </div>
                    <div className="row invitation-btns">
                        <div className="col-2 decline" onClick={() => this.props.handleDecline(this.props.userPendingInvitation)}>
                            <i className="fas fa-2x fa-times"></i>
                        </div>
                        <div className="col-2 accept">
                            <i className="fas fa-2x fa-check"></i>
                        </div>
                    </div>
                </div>
            </div>
    )}
}

export default PendingFriend;
