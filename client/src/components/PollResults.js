import React from 'react';

const PollResults = () => {
    return(
        <div className="row d-flex justify-content-around poll-icons">
            <div className="col-6 poll-icons-col">
            </div>
            <div className="col-6 poll-icons-col">
                <img className="user-avatar poll-icons-images rounded-circle w-10" src={'/images/avatars/' + 'afro' + '-avatar.png'} />
            </div>
        </div>
    );
};

export default PollResults;
