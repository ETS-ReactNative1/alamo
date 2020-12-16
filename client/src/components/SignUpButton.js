import React from 'react';
import { withRouter } from 'react-router-dom';

const SignUpButton = (props) => {

    const redirect = (path) => {
        props.history.push(path);
    }

    return (
        <button onClick={() => redirect('/sign-up')} class="btn secondary-btn my-2 my-sm-0">Sign Up</button>                
    );
}

export default withRouter(SignUpButton);
