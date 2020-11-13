import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';


const LogoutItem = () => {
    const socket = io.connect('http://localhost:8080')

    const logout = () => {
        console.log('logout')
        axios.get('/auth/logout')
            .then((response) => {
                if (response.status === 200)
                    socket.emit('user-offline', localStorage.getItem('userId'))
                    window.location.reload();
            })
    }

    return (
        <li onClick={() => logout()} className="context-item">Logout</li>
    );
}

export default LogoutItem;
