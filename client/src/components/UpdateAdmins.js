import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import AdminCard from './AdminCard';

const Admins  = (props) => {
    const [ adminsTemp, setAdmins ] = React.useState([])

    React.useEffect(() => {
        axios.get('/room', {params :{roomId: window.location.pathname.substring(5)}})
            .then((response) => setAdmins(response.data.admins))
            .catch((err) => console.log(err))
    }, [])
    
    const addAdmins = (event) => {
        const admin = event.currentTarget.id
        setAdmins(admins => [...admins, admin])
        axios.post('/room/admin', {roomId: window.location.pathname.substring(5), adminId: admin})
            .then((response) => console.log(response))
            .catch((err) => console.log(err))
    }

    const removeAdmins = (event) => {
        const admin = event.currentTarget.id
        const updateAdmins  = adminsTemp.filter(item => item !== admin)
        setAdmins(updateAdmins)
        axios.delete('/room/admin', {data: {roomId: window.location.pathname.substring(5), adminId: admin}})
            .then((response) => console.log(response))
            .catch((err) => console.log(err))
    }

    return(
        <div className="container-fluid invite-friends-container">
            <div className="row">
                <div classNamme="col">
                    <h3 class="more-stream-heading thin d-block margin-top">Room Admins</h3>
                </div>
            </div>
            {props.admins.map((admin) => {
                if (admin === localStorage.getItem('userId')) {
                    return(
                        <div className="row justify-content-between align-items-center">
                            <div className="col">
                                <AdminCard socket={props.socket} key={'admin-'+admin} userId={admin}/>
                            </div>
                            <div className="col-2">
                                {(adminsTemp.includes(admin, 0)) ? 
                                    <button id={admin} type="button" className="primary-btn small-btn-invite disabled" onClick={(event) => removeAdmins(event)}>
                                        Remove
                                    </button>
                                    :
                                    <button id={admin} type="button" className="primary-btn small-btn-invite" onClick={(event) => addAdmins(event)}>
                                        Add
                                    </button>
                                }
                            </div>
                        </div>
                        )
                    } else {
                        return(
                            <div className="row justify-content-between align-items-center">
                                <div className="col">
                                    <AdminCard socket={props.socket} key={'admin-'+admin} userId={admin}/>
                                </div>
                                <div className="col-2">
                                    {(adminsTemp.includes(admin, 0)) ? 
                                        <button id={admin} type="button" className="primary-btn small-btn-invite" onClick={(event) => removeAdmins(event)}>
                                            Remove
                                        </button>
                                        :
                                        <button id={admin} type="button" className="primary-btn small-btn-invite" onClick={(event) => addAdmins(event)}>
                                            Add
                                        </button>
                                    }
                                </div>
                            </div>

                        )
                    }
                }
            )}

            {props.friends.map((friend) => {
                if (!props.admins.includes(friend, 0))
                    return(
                        <div className="row justify-content-between align-items-center">
                            <div className="col">
                                <AdminCard socket={props.socket} key={'admin-'+friend} userId={friend}/>
                            </div>
                            <div className="col-2">
                                {(adminsTemp.includes(friend, 0)) ? 
                                    <button id={friend} type="button" className="primary-btn small-btn-invite" onClick={(event) => removeAdmins(event)}>
                                        Remove
                                    </button>
                                    :
                                    <button id={friend} type="button" className={(friend === localStorage.getItem('userId')) ? "primary-btn small-btn-invite disabled" : "primary-btn small-btn-invite"} onClick={(event) => addAdmins(event)}>
                                        Add
                                    </button>
                                }
                            </div>
                        </div>
                    )
                }
            )}
        </div>
    )
};

export default Admins;
