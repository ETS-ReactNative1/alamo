import React from 'react';

const UserAvatar = (props) => {
    const [ loading, setLoading ] = React.useState(true);

    return(
        <React.Fragment>
            {loading ? <div style={{transform: 'scale(0.4)', top: '4px', left: '35px'}} className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}
            <img onLoad={() => setLoading(false)} onError={() => setLoading(true)} className="user-avatar rounded-circle w-15" src={props.avatar} />
        </React.Fragment>
    )
}

export default UserAvatar;
