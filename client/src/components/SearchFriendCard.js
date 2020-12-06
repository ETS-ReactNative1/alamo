import React from 'react';

const SearchFriendCard = (props) => {
    return(
        <div id={props.userId} className="row sidebar-friend align-items-center">
            <div className="col-3">
                <img className="user-avatar rounded-circle w-15" src={props.avatar} />
            </div>
            <div className="col-9">
                <div className="row">
                    <div className="col">
                        <h3 className="username bold">{props.username}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6 className="user-status thin">Watching Valorant...</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchFriendCard;
