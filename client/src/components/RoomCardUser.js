import React from 'react';
import axios from 'axios';

const RoomCardUser = (props) => {
    const [ user, setUser ] = React.useState()
    const [ avatar, setAvatar ] = React.useState()

    const getUser = () => {
        axios.get('/user', {params: {userId: props.userId}})
            .then((response) => {
                setUser(response.data[0].user_metadata.username)
                setAvatar(response.data[0].user_metadata.avatar)
            })
            .catch((err) => console.log(err))
    }

    React.useEffect(() => {
       getUser(); 
    }, [])

    return(
        <img src={"/images/avatars/" + avatar + "-avatar.png"} alt={user} />
    )
}

export default RoomCardUser;
