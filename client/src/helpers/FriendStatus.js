import axios from 'axios';

const FriendStatus = async (clientId, friendsId) => {
    const checkFriendStatus = new Promise((resolve, reject) => {
        axios.get('/check-friend-status', {params: {searcherId: clientId, recipentId: friendsId}})
            .then(friendStatus => {
                resolve(friendStatus.data.friendStatus)
            })    
            .catch((err) => () => {
                reject(err)
            })
    })
    return checkFriendStatus
};

export default FriendStatus;
