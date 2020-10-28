import React from 'react';
import axios from 'axios';

const PendingFriend = (props) => {

    const [state, setState] = React.useState([])

    React.useEffect(() => {
        const fetchPendingInvitation = async () => {
            const response = await axios.get('/userId', {params: {userId: props.userId}})
            setState(response.data[0])
        }
        fetchPendingInvitation();
    }, [])

    const username = state.user_metadata && state.user_metadata.username;
    const avatar = state.user_metadata && state.user_metadata.avatar;

    console.log(state)
    return(
        <div id={props.userId} className="row sidebar-friend align-items-center">
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + avatar + '-avatar.png'} />
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{username}</h3>
                    </div>
                </div>
                <div className="row invitation-btns">
                    <div className="col-2 decline">
                        <i className="fas fa-2x fa-times"></i>
                    </div>
                    <div className="col-2 accept">
                        <i className="fas fa-2x fa-check"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PendingFriend;
