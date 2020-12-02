import axios from 'axios';

const isRoomFavourited = async (userId, roomId) => {
    const isFavourite = new Promise((resolve, reject) => {
        axios.get('/user', {params: {userId: userId}})
            .then((response) => {
                if (response.data[0].rooms.includes(roomId, 0))
                    resolve(true)
                else
                    resolve(false)
            })
            .catch((err) => reject(err))
    })

    return isFavourite;
};

export default isRoomFavourited;
