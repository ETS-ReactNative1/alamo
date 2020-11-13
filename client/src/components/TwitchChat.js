import React from 'react';

const TwitchChat = (props) => {
    const url = `https://www.twitch.tv/embed/${props.twitchChannel}/chat?darkpopout&migration=true&parent=localhost`;
    console.log(url)
    return(
        <div className="container twitch-chat-row">
            <div className="row">
                <div className="col-12" style={{height: 'calc(100vh - 150px)', marginLeft: '24px'}}>
                    <iframe id="frame" frameborder="100%" scrolling="yes" src={url} height="100%" width="100%"></iframe>
                </div>
            </div>
        </div>
    )
}

export default TwitchChat;
