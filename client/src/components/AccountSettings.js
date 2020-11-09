import React from "react";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class AccountSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            changeEmail: false,
            changePassword: false,
            changePasswordMessage: null,
            deleteAccount: false
        }
    }

    handleCancelRoom = () => {
        this.props.history.goBack();
    }

    handleChangeEmail = () => {
        if (this.state.changeEmail === true) {
            return(
                <form action="post" onSubmit={this.handleChangeEmailSubmit}> 
                    <input name="newEmail"  placeholder="New Email" required/>
                    <button className="alternative-btn block" type="submit">Save</button>
                </form>
            )
        }
    }

    handleChangePassword = () => {
        if (this.state.changePassword === true) {
            return(
                <form action="post" onSubmit={this.handleChangePasswordSubmit}> 
                    <input className="password-input" type="password" name="newPassword" placeholder="New Password" required onKeyDown={this.restrictSpace}/>
                    <input className="password-input" type="password" name="newPasswordConfirmation" placeholder="Confirm Password" required/>
                    <h6 id="username-available">{this.state.changePasswordMessage}</h6>
                    <button className="alternative-btn block" type="submit">Save</button>
                </form>
            )
        }
    }

    errorCheckPassword = (initialPassword, confirmationPassword) => {
        if (initialPassword != confirmationPassword) return this.setState({changePasswordMessage: 'Passwords do not match'}) 
    }

    handleChangePasswordSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.newPassword.value, event.target.newPasswordConfirmation.value)
        this.errorCheckPassword(event.target.newPassword.value, event.target.newPasswordConfirmation.value)
    }

    handleSubmit =  (event) => {
        event.preventDefault();
    }

    handleDeleteAccount = () => {
        if (this.state.deleteAccount === true) {
            return(
                <form action="post" onSubmit={this.handleAccountDeleteSubmit}>
                    <label for="confirmAccountDeletion" className="sub-label thin">Please type <strong>{this.props.userInformation.username}/alamo</strong> to confirm</label>
                    <input name="confirmAccountDeletion" autoFocus required/>
                    <button type="submit" className="primary-btn block" style={{backgroundColor: 'DarkRed'}}>Delete</button>
                </form>
            )
        }
    }

    render() {
        return (
          <div className="container">
              <div className="row">
                  <div className="col">
                      <h1 className="setup-heading thin">Account Settings</h1>

                      <label htmlFor="username">Username</label>
                      <input name="username" autoFocus required minlength="3" placeholder={this.props.userInformation.user_metadata.username} disabled/>
                      <h6 id="username-available">Usernames cannot be changed</h6>

                      <label htmlFor="username">Email</label>
                      <input name="username" autoFocus required minlength="3" placeholder={this.props.userInformation.email} disabled/>
                      {this.handleChangeEmail()}
                      {this.state.changeEmail ? null : <button className="alternative-btn" onClick={() => this.setState({changeEmail: true})}>Edit</button> }

                      <label htmlFor="username">Password</label>
                      <input name="username" autoFocus required minlength="3" placeholder="••••••••••" type="password" disabled/>
                      {this.handleChangePassword()}
                      {this.state.changePassword ? null : <button className="alternative-btn" onClick={() => this.setState({changePassword: true})}>Edit</button> }

                      <label htmlFor="username">Delete Account</label>
                      {this.handleDeleteAccount()}
                      {this.state.deleteAccount ? null : <button className="primary-btn block" style={{backgroundColor: 'DarkRed'}} onClick={() => this.setState({deleteAccount: true})}>Delete</button> }

                      <button className="secondary-btn setup-btn" onClick={this.handleCancelRoom}>Cancel</button>
                  </div>
              </div>
          </div>
      )};
};

export default withRouter(AccountSettings);
