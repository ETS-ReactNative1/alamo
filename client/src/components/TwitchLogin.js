import React from 'react';

class TwitchLogin extends React.Component {
    render() {
        return(
            <div className="twitch-login-toast">
                <h6 className="twitch-login-caption">Login to Twitch to comment</h6>
                <button type="button" className="primary-btn twitch-login-btn">
                <i className="fab fa-1x fa-twitch twitch-icon"></i> Twitch Login
                </button>
            </div>
        )
    }
}

export default TwitchLogin;
