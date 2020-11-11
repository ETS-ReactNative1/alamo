import React from 'react';

const TwitchPlayer = () => {
    return (
        <div className="row">
            <div className="col-12 room-video">
                <iframe src="https://embed.twitch.tv?allowfullscreen=true&amp;channel=ESL_CSGO&amp;font-size=small&amp;height=100%25&amp;layout=video&amp;migration=true&amp;parent=localhost&amp;referrer=http%3A%2F%2Flocalhost%3A3000%2Froom%2Fb72c47c9-5345-422a-9c77-1849e9ecfb61&amp;theme=dark&amp;width=100%25" allowfullscreen="" scrolling="no" frameborder="0" allow="autoplay; fullscreen" title="Twitch" sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
            </div>
        </div>
    );
}

export default TwitchPlayer;
