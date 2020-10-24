import React from "react";
import axios from 'axios';

class ProfileSetup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            avatars : ['afro', 'avacado', 'batman', 'bear', 'chaplin', 'cloud', 'halloween', 'sheep', 'sloth', 'suicide-squad', 'wrestler'],
            avatarSelected: '',
        }
    }

    updateAvatar = (event) => {
        this.setState({avatarSelected: event.currentTarget.id})
    }

    handleSubmit =  (event) => {
        event.preventDefault();
        console.log(event.target[0].value, this.state.avatarSelected, this.props.user.email)

        let payload = {username: event.target[0].value, avatar: this.state.avatarSelected, email: this.props.user.email}

        axios.post('/complete-profile', payload)
          .then(function (response) {
            console.log(response);
            window.location.reload();
          })
    }

    render() {
        return (
          <div className="container">
              <div className="row">
                  <div className="col">
                      <h1 className="logo-main centered margin-top">alamo</h1>
                      <h1 className="setup-heading thin">Profile Setup</h1>

                      <form action="post" onSubmit={this.handleSubmit}>
                          <label htmlFor="username">Username</label>
                          <input name="username" autoFocus />
                          <h6 id="username-available">Username available</h6>
                          <label htmlFor="avatar">Avatar</label>

                          {this.state.avatars.map((avatar) => {
                            let srcPath = `/images/avatars/${avatar}-avatar.png`
                            return(
                                <img key={avatar} onClick={this.updateAvatar} className="avatar-image-selection rounded-circle" src={srcPath} alt={avatar} id={avatar} />
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
