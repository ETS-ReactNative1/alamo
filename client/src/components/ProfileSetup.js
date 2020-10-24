import React from "react";

const ProfileSetup = () => {
    
    const srcPath = '/images/avatars/';

    let avatars = ['afro', 'avacado', 'batman', 'bear', 'chaplin', 'cloud', 'halloween', 'sheep', 'sloth', 'suicide-squad', 'wrestler']

    return (
      <div className="container">
          <div className="row">
              <div className="col">
                  <h1 className="logo-main centered margin-top">alamo</h1>
                  <h1 className="setup-heading thin">Profile Setup</h1>

                  <form action="post">
                      <label htmlFor="username">Username</label>
                      <input type="username" autofocus />
                      <h6 id="username-available">Username available</h6>
                      <label htmlFor="avatar">Avatar</label>

                      {avatars.map((avatar) => {
                        let srcPath = `/images/avatars/${avatar}-avatar.png`
                        return(
                          <img className="avatar-image-selection" src={srcPath} alt={avatar} id={avatar} />
                        )
                      })}

                      <button className="secondary-btn setup-btn block">Save</button>

                  </form>
              </div>
          </div>
      </div>
  );
};

export default ProfileSetup;
