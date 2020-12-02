import React from 'react';

import PollUser from './PollUser';

const PollResults = (props) => {
    return(
        <div className="row d-flex justify-content-around poll-icons">
            <div className="col-6 poll-icons-col">
                {props.noUsers.map((user) => {
                    return(
                        <PollUser user={user}/>
                    )
                })}
            </div>
            <div className="col-6 poll-icons-col">
                {props.yesUsers.map((user) => {
                    return(
                        <PollUser user={user}/>
                    )
                })}
            </div>
        </div>
    );
};

export default PollResults;
