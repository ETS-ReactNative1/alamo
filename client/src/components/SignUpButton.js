import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => loginWithRedirect({screen_hint: 'signup'})} class="btn secondary-btn my-2 my-sm-0">Sign Up</button>                
    );
}

export default SignUpButton;
