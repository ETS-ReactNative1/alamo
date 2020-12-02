import React from "react";
import axios from 'axios';

class ProfileSetup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            avatars : ['afro', 'avacado', 'batman', 'bear', 'chaplin', 'cloud', 'halloween', 'sheep', 'sloth', 'suicide-squad', 'wrestler'],
            avatarSelected: '',
            usernameAvailable: '',
            selectAvatar: ''
        }
    }

    updateAvatar = (event) => {
        this.setState({avatarSelected: event.currentTarget.id})
        console.log(this.state.avatarSelected)
    }

    handleSubmit =  (event) => {
        event.preventDefault();
        console.log(event.target[0].value, this.state.avatarSelected, this.props.user.email)

        if (this.state.avatarSelected.length === 0) {
            this.setState({selectAvatar: 'Please selected an avatar.'})
        } else {
            let payload = {username: event.target[0].value, avatar: this.state.avatarSelected, email: this.props.user.email}

            axios.post('/user/complete-profile', payload)
                .then(response => {
                  window.location.reload();
              }).catch(error => {
                  this.setState({usernameAvailable: 'Username already taken. Please enter new username.'})
              });
        }
    }

    render() {
        return (
          <div className="container">
              <div className="row">
                  <div className="col">
                      <h1 className="logo-main centered margin-top">alamo</h1>
                      <h1 className="setup-heading thin">Profile Setup</h1>

                      <form action="post" onSubmit={this.handleSubmit}>
                          <label className="profile-setup-label" htmlFor="username">Username</label>
                          <input name="username" autoFocus required minlength="3" />
                          <h6 id="username-available">{this.state.usernameAvailable}</h6>
                          <label hclassName="profile-setup-label" tmlFor="avatar">Avatar</label>
                          <h6 id="avatar-selected-error">{this.state.selectAvatar}</h6>
                          {this.state.avatars.map((avatar) => {
                            let srcPath = `/images/avatars/${avatar}-avatar.png`
                            return(
                                <img key={avatar} onClick={this.updateAvatar} className={(this.state.avatarSelected === avatar) ? "avatar-image-selection avatar-selected rounded-circle" : "avatar-image-selectedion rounded-circle"} src={srcPath} alt={avatar} id={avatar} />
                            )
                          })}
                          <button type="submit" className="primary-btn setup-btn block">Save</button>
                      </form>
                  </div>
              </div>
          </div>
      )};
};

export default ProfileSetup;
