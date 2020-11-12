import React from 'react';
import { withRouter } from 'react-router-dom'

const LoginButton = (props) => {

    const redirect = (path) => {
        props.history.push(path);
    }

    return (
        <button onClick={() => redirect('/login')} class="btn primary-btn my-2 my-sm-0">Login</button>                
    );
}

export default withRouter(LoginButton);
