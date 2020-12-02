import React from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import ImageUploader from 'react-images-upload';
import {Image, CloudinaryContext} from 'cloudinary-react';

class ProfileSetup extends React.Component {
    constructor(props) {
        super(props)

        this.onDrop = this.onDrop.bind(this);

        this.state = {
            loading: false,
            avatars : ['afro', 'avacado', 'batman', 'bear', 'chaplin', 'cloud', 'halloween', 'sheep', 'sloth', 'suicide-squad', 'wrestler'],
            avatarSelected: '',
            usernameAvailable: '',
            selectAvatar: '',
            pictures: []
        }
    }

    updateAvatar = (event) => {
        this.setState({avatarSelected: event.currentTarget.id})
        console.log(this.state.avatarSelected)
    }

    onDrop(pictureFiles, pictureDataURLs) {
        console.log(pictureFiles, pictureDataURLs, 'UPLOAD')
        this.setState({
            pictures: this.state.pictures.concat(pictureFiles)
        });
    }

    handleSubmit =  (event) => {
        event.preventDefault();

        if (this.state.avatarSelected.length === 0 && this.state.pictures.length === 0) {
            this.setState({selectAvatar: 'Please selected or upload an avatar.'})
        } else {
            //If both avatar and upload is selected, go with upload
            if (this.state.pictures.length > 0) {
                this.setState({loading: true})
                const headers = {'content-type': 'multipart/form-data'}
                const formData = new FormData();
                formData.append("file", this.state.pictures[0]);
                formData.append("upload_preset", "be1eap2p");
                formData.append("api_key", "964575383773823");
                axios.post('https://api.cloudinary.com/v1_1/dv3fod2s5/upload', formData, headers)
                    .then((response) => {
                        if (response.status === 200) {
                            axios.post('/user/change-avatar', {userId: localStorage.getItem('userId'), avatar: response.data.secure_url})
                                .then((upload) => {
                                    if (upload.status === 200) {
                                        this.props.fetchUserInformation();
                                        this.setState({loading: false, pictures: [], selectAvatar: 'Avatar successfully changed.'})
                                    } else {
                                        this.setState({selectAvatar: 'File unsuccessfully uploaded. Please try again or check file.'})
                                    }
                                })
                                .catch((err) => console.log(err))
                        }
                    })
                    .catch((err) => console.log(err))

            } else {
                const avatar = `/images/avatars/${this.state.avatarSelected}-avatar.png`
                axios.post('/user/change-avatar', {userId: localStorage.getItem('userId'), avatar: avatar})
                    .then((response) => {
                        if (response.status === 200) {
                            this.props.fetchUserInformation();
                            this.setState({selectAvatar: 'Avatar successfully changed.'})
                        } else {
                            this.setState({selectAvatar: 'Unable to change avatar at this time. Please try again later.'})
                        }
                    })
                    .catch((err) => console.log(err))
            }
        }
    }

    render() {
        return (
            <div className="container" style={{paddingBottom: '50px'}}>
              <div className="row">
                  <div className="col">
                      <div className="room-headings">
                            <i className="fas back-arrow font-color fa-2x fa-arrow-left" onClick={() => this.props.history.goBack()}></i>
                            <h1 className="room-title">Change Avatar</h1>
                      </div>


                      <form action="post" onSubmit={this.handleSubmit}>
                            <label hclassName="profile-setup-label" tmlFor="avatar">Avatar</label>
                            {this.state.avatars.map((avatar) => {
                            let srcPath = `/images/avatars/${avatar}-avatar.png`
                                return(
                                    <img key={avatar} onClick={this.updateAvatar} className={(this.state.avatarSelected === avatar) ? "avatar-image-selection avatar-selected rounded-circle" : "avatar-image-selectedion rounded-circle"} src={srcPath} alt={avatar} id={avatar} />
                                )
                            })}
                            <label hclassName="profile-setup-label" tmlFor="avatar">Upload Avatar</label>
                            <div className="file-upload-container">
                                {this.state.loading ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null }
                                <ImageUploader
                                    withIcon={true}
                                    buttonText="Choose images"
                                    onChange={this.onDrop}
                                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    singleImage={true}
                                />
                            </div>
                            <h6 id="avatar-selected-error">{this.state.selectAvatar}</h6>
                          <button type="submit" className={this.state.loading ? "primary-btn setup-btn disabled" : "primary-btn setup-btn"} style={{marginRight: '25px'}}>Save</button>
                            <button className="secondary-btn setup-btn" onClick={() => this.props.history.push('/')}>Cancel</button>
                      </form>
                  </div>
              </div>
          </div>
      )};
};

export default withRouter(ProfileSetup);
