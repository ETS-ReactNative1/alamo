import React from 'react';

const HoverCard = (props) => {

    const friendStatus = () => {
        if (props.userId != localStorage.getItem('userId')) {
            return(
                <div className="col-3 hover-card-col">
                    {(props.friendStatus === true) ? <i title="Friends" className="friend-add-icon fas fa-1x fa-check-circle"></i> : null }
                    {(props.friendStatus === false) ? <i title="Add Friend" className="friend-add-icon fas fa-1x fa-plus-square"></i> : null }
                    {(props.friendStatus === 'pending') ? <i title="Pending Friend Invite" className="friend-add-icon fas fa-1x fa-user-clock"></i> : null }
                </div>
            )
        } else return null
    }

    console.log(props.userId)
    console.log(props.position, 'this is position')

    return(
        <div onMouseOver={props.handleMouseOver} className={(props.position === 'top') ? "container hover-card hover-card-top" : "container hover-card hover-card-bottom"}>
            <div id={props.userId} className="row sidebar-friend align-items-center">
                <div className="col-3">
                    {props.online ? <i class="fas fa-circle online"></i> : null }
                    <img className="user-avatar rounded-circle w-15" src={'/images/avatars/' + props.avatar + '-avatar.png'} />
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
            <div className="row">
                <div className="col-3 hover-card-col">
                    <i class="fas hover-card-icons fa-volume-mute" title="Mute"></i>
                </div>
                <div className="col-3 hover-card-col">
                    <i class="fas hover-card-icons fa-id-badge" title="Make Moderator"></i>
                </div>

                {friendStatus()}

                <div className="col-3 hover-card-col">
                    <i class="fas hover-card-icons fa-user-alt-slash" title="Kick"></i>
                </div>
            </div>
        </div>
    )
}

export default HoverCard;
