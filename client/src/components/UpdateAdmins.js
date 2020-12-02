import React from 'react';
import { Redirect } from 'react-router-dom';

import AdminCard from './AdminCard';

const Admins  = (props) => {
    const [ admins, setAdmins ] = React.useState([])
    console.log(props.admins, 'ADMINSSSS')
    
    const updateAdmins = (event) => {
        const admin = event.currentTarget.id
        setAdmins(admins => [...admins, admin])
    }


    return(
        <div className="container-fluid invite-friends-container">
            <div className="row">
                <div classNamme="col">
                    <h3 class="more-stream-heading thin d-block margin-top">Room Admins</h3>
                </div>
            </div>
            {props.admins.map((admin) => {
                if (admin !== localStorage.getItem('userId'))
                    return(
                        <div className="row justify-content-between align-items-center">
                            <div className="col">
                                <AdminCard socket={props.socket} key={'admin-'+admin} userId={admin}/>
                            </div>
                            <div className="col-2">
                                {(admins.includes(admin, 0)) ? 
                                    <button id={admin} type="button" className="primary-btn small-btn-invite passthrough" style={{paddingLeft: '16px'}}>
                                        Removed
                                        <i className="fas fa-check favourite-icon"></i>
                                    </button>
                                    :
                                    <button id={admin} type="button" className={props.adminRights ? "primary-btn small-btn-invite" : "primary-btn small-btn-invite disabled"} onClick={(event) => updateAdmins(event)}>
                                        Remove
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
