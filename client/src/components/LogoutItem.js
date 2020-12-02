import React from 'react';
import axios from 'axios';


const LogoutItem = (props) => {
    const logout = () => {
        console.log('logout')
        axios.get('/auth/logout')
            .then((response) => {
                if (response.status === 200)
                    props.socket.emit('user-offline', localStorage.getItem('userId'))
                    window.location.reload();
            })
    }

    return (
        <li onClick={() => logout()} className="context-item">Logout</li>
    );
}

export default LogoutItem;
