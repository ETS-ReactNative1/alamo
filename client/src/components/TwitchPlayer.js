import React from 'react';
import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';

const Twitch = () => {
    return (
        <TwitchEmbed
            channel="Gaules"
            id="Gaules"
            theme="dark"
            withChat={false}
            muted
            onVideoPause={() => console.log(':(')}
        />
    );
}

export default Twitch;
