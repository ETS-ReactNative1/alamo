import React from 'react';
import axios from 'axios';

const PollUser = (props) => {
    const [avatar, setAvatar] = React.useState([]);

    const getUser = () =>{
        axios.get('/user', {params: {userId: props.user}})
            .then((response) =>{
                setAvatar(response.data[0].user_metadata.avatar)
            })
            .catch((err) => console.log(err))
    }

    React.useEffect(() => {
       getUser(); 
    }, [])

    return(
        <img className="user-avatar poll-icons-images rounded-circle w-10" src={'/images/avatars/' + avatar + '-avatar.png'} />
    )
};

export default PollUser;
