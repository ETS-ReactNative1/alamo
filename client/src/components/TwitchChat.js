import React from 'react';

const TwitchChat = (props) => {
    const [ show, setShow ] = React.useState(false)
    const [ message, setMessage ] = React.useState('View Chat')
    const url = `https://www.twitch.tv/embed/${props.twitchChannel}/chat?darkpopout&migration=true&parent=localhost`;
    console.log(url)

    const showChat = () => {
        setShow(!show) 
        if (show)
            setMessage('Hide Chat')
        else 
            setMessage('View Chat')
    }
    if (props.mobile) {
        return(
        <div className="container-fluid twitch-chat">
            <div className={show ? "row twitch-chat-row show-chat" : "row twitch-chat-row"}>
                <div className="col-12">
                    <iframe id="frame" className="twitch-iframe" frameborder="100%" scrolling="yes" src={url} height="100%" width="100%"></iframe>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="view-more d-md-none d-sm-none d-xs-block" onClick={() => showChat()} style={{borderRadius: '0 0 5px 5px', backgroundColor: '#18181B', color: '#dedee3'}}>{message}</div>
                </div>
            </div>
        </div>
        )
    } else {
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
}

export default TwitchChat;
