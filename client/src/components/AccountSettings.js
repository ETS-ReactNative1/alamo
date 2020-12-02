import React from "react";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import NiceInputPassword from 'react-nice-input-password';
import 'react-nice-input-password/dist/react-nice-input-password.css';

class AccountSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            changeEmail: false,
            changePassword: false,
            password: '',
            confirmationPassword: '',
            isValid: false,
            changePasswordMessage: '',
            changePasswordSuccess: '',
            deleteAccount: false
        }
    }

    getUserInformation = () => {
        axios.get('/auth/user')
            .then((response) => {
                this.setState({username: response.data.user_metadata.username, email: response.data.email})
            })
            .catch((err) => console.log(err))
    }

    handleCancelRoom = () => {
        this.props.history.goBack();
    }

    componentDidMount() {
        this.getUserInformation();
    }

    handleChangeEmail = () => {
        if (this.state.changeEmail === true) {
            return(
                <form action="post" onSubmit={this.handleChangeEmailSubmit}> 
                    <input name="newEmail"  placeholder="New Email" required/>
                    <h6 id="username-available">{this.state.emailErrorMessage}</h6>
                    <button className="alternative-btn block" type="submit">Save</button>
                </form>
            )
        }
    }

    handleChangeEmailSubmit = (event) => {
        event.preventDefault();
        const newEmail = event.target.newEmail.value;

        let userData = {userId: localStorage.getItem('userId'), newEmail: newEmail}

        axios.post('/user/change-email', userData)
            .then((response) => {
                this.setState({changeEmailSuccess: 'Email has been successfully changed', emailErrorMessage: '', changeEmail: false})
                this.getUserInformation();
            })
            .catch((err) => this.setState({emailErrorMessage: 'A user already exists with this email', changeEmailSuccess: ''}))
    }

    handlePasswordChange = (data) => {
        this.setState({password: data.value, isValid: data.isValid})
    }

    handleConfirmationPasswordChange = (event) => {
        this.setState({confirmationPassword: event.currentTarget.value})
    }

    handleChangePassword = () => {
        if (this.state.changePassword === true) {
            return(
                <form action="post" onSubmit={this.handleChangePasswordSubmit}> 
                    <NiceInputPassword
                        style={{fontWeight: '400', color: '#F2E7FE'}}
                        name="passwordField"
                        value={this.state.password}
                        placeholder="Password"
                        securityLevels={[
                            {
                                descriptionLabel: '1 number',
                                validator: /.*[0-9].*/,
                            },
                            {
                                descriptionLabel: '1 lowercase letter',
                                validator: /.*[a-z].*/,
                            },
                            {
                                descriptionLabel: '1 uppercase letter',
                                validator: /.*[A-Z].*/,
                            },
                        ]}
                        showSecurityLevelBar
                        showSecurityLevelDescription
                        required
                        onChange={this.handlePasswordChange}
                    />
                    <input className="password-input" style={{width: '100%'}} type="password" name="newPasswordConfirmation" placeholder="Confirm Password" required onChange={this.handleConfirmationPasswordChange}/>
                    <h6 id="username-available">{this.state.changePasswordMessage}</h6>
                    <button className="alternative-btn block" type="submit">Save</button>
                </form>
            )
        }
    }

    handleChangePasswordSubmit = (event) => {
        event.preventDefault();
        if (this.state.password === this.state.confirmationPassword) {
            this.setState({changePasswordMessage: ''})
        } else {
            return this.setState({changePasswordMessage: 'Passwords do not match'})
        } 

        if (this.state.isValid) {
            let userData = {email: this.state.email, password: this.state.password}
            axios.post('/auth/change-password', userData)
                .then((response) => {
                    this.setState({changePasswordSuccess: 'Password has been successfully changed', changePasswordMessage: '', changePassword: false})
                })
                .catch((err) => console.log(err))
        } else {
            return this.setState({changePasswordMessage: 'Invalid Password', changePasswordSuccess: ''}) 
        }
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
              <div className="row margin-bottom-50">
                  <div className="col">
                      <div className="room-headings">
                            <i className="fas back-arrow font-color fa-2x fa-arrow-left" onClick={() => this.props.history.goBack()}></i>
                            <h1 className="room-title">Account Settings</h1>
                      </div>


                      <label htmlFor="username">Username</label>
                      <input name="username" autoFocus required minlength="3" placeholder={this.state.username} disabled/>
                      <h6 id="username-available">Usernames cannot be changed</h6>

                      <label htmlFor="username">Email</label>
                      <input name="username" autoFocus required minlength="3" placeholder={this.state.email} disabled/>
                      {this.handleChangeEmail()}
                      <h6 id="success-message">{this.state.changeEmailSuccess}</h6>
                      {this.state.changeEmail ? null : <button className="alternative-btn" onClick={() => this.setState({changeEmail: true})}>Edit</button> }

                      <label htmlFor="username">Password</label>
                      <input name="username" autoFocus required minlength="3" placeholder="••••••••••" type="password" disabled/>
                      {this.handleChangePassword()}
                      <h6 id="success-message">{this.state.changePasswordSuccess}</h6>
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
