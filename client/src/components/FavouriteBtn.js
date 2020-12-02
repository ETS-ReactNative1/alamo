import React from 'react';
import axios from 'axios';

import isRoomFavourited from '../helpers/isRoomFavourited';

const FavouriteBtn = (props) => {
    const [ isFavourite, setFavourite ] = React.useState(false);
    
    const addToFavourties = () => {
        axios.post('/user/add-room', {userId: localStorage.getItem('userId'), roomId: props.activeRoom})
            .then((response) => {
                setFavourite(true)
                props.fetchUserInformation();
            })
    }

    const removeFromFavourites = () => {
        axios.delete('/user/room', {data: {userId: localStorage.getItem('userId'), roomId: props.activeRoom}})
            .then((response) => {
                props.fetchUserInformation();
                setFavourite(false);
            })
            .catch((err) => {
                console.log(err)
            })

    }

    React.useEffect(() => {
        isRoomFavourited(localStorage.getItem('userId'), props.activeRoom)
            .then((status) => setFavourite(status))
    }, [])

    
    if (isFavourite) {
        if (props.matches) {
            return(
                <button className="primary-btn small-btn favourite" onClick={removeFromFavourites} style={{paddingLeft: '16px', marginLeft: '14px', marginRight: '14px'}}>
                    Favourited
                    <i className="fas fa-check favourite-icon"></i>
                </button>
            )        
        } else {
            return(
                <button className="primary-btn small-btn favourite" onClick={removeFromFavourites} style={{ marginLeft: '14px', marginRight: '14px', minWidth: '40px'}}>
                    <i className="fas fa-check favourite-icon"></i>
                </button>
            )        
        }


    } else {
        if (props.matches) {
            return(
                <button className="muted-btn" onClick={addToFavourties}>
                    Favourite
                    <i className="fas fa-heart favourite-icon"></i>
                </button>
            )
        } else {
            return(
                <button className="muted-btn" onClick={addToFavourties} style={{minWidth: '40px'}}>
                    <i className="fas fa-heart favourite-icon"></i>
                </button>
            )
        }
    }

}

export default FavouriteBtn;
