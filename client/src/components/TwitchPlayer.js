import React from 'react';

const TwitchPlayer = (props) => {
    const url = `https://player.twitch.tv/?channel=${props.twitchChannel}&migration=true&parent=alamo-d19124355.herokuapp.com`

    return (
        <div className="row">
            <div className="col-12 room-video">
                <iframe src={url} allowfullscreen="true" scrolling="no" frameborder="0" allow="autoplay; fullscreen" title="Twitch" sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
            </div>
        </div>
    );
}

export default TwitchPlayer;
