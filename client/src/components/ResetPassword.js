import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import NiceInputPassword from 'react-nice-input-password';
import 'react-nice-input-password/dist/react-nice-input-password.css';

import Loading from './Loading';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            requestSuccess: false,
            password: '',
            confirmationPassword: '',
            errorMessage: '',
            isValidToken: false,
        }
    }

    componentDidMount() {
        const token = window.location.pathname.substring(7);
        axios.get(`/auth/check-token/${token}`)
            .then((response) => {
                this.setState({isValidToken: true, isLoading: false})
            })
            .catch((err) => console.log(err))
    }

    handleSubmit = (event) => {

       event.preventDefault();
       if (this.state.password === this.state.confirmationPassword) {
            this.setState({passMatch: ''})
       } else {
            return this.setState({passMatch: 'Passwords do not match'})
       } 

        if (this.state.isValid) {
            console.log('post form')
            let email = this.state.email
            let password = this.state.password;
            let userData = {email, password}

            console.log(userData)

            axios.post('/auth/signup', userData)
                .then((response) => {
                    if (response.status === 200) {
                        window.location.assign('/')
                    } 
                })
                .catch((err) => this.setState({errorMessage: 'User already exists'}))
        } else return this.setState({errorMessage: 'Invalid Password'}) 
    }


    handlePasswordChange = (data) => {
        this.setState({password: data.value, isValid: data.isValid})
    }

    handleConfirmationPasswordChange = (event) => {
        this.setState({confirmationPassword: event.currentTarget.value})
    }


    validToken = () => {
        if (this.state.isLoading) {
            return <Loading/>
        } else if (this.state.isValidToken) {
            return(
                <React.Fragment>
                    {this.state.isLoading ? <Loading/>: null}

                    <h1 className="login-logo centered margin-bottom">alamo</h1>
                    <p className="password-para">Please enter your email address</p>
                    <form className="signup-form" action="POST" onSubmit={this.handleSubmit}>
                        <NiceInputPassword
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
                        <input className="login-input" onChange={this.handleConfirmationPasswordChange} type="password" name="email" placeholder="Confirm Password" required/>
                        <button className="primary-btn login-button" type="submit">Reset Password</button>
                    </form>

                    {(this.state.errorMessage.length > 0) ? 
                        <div className="signup-error-box">
                            <h6 className="login-error-message">{this.state.errorMessage}{this.state.passMatch}</h6>
                        </div> :
                        null
                    }
                    <p className="sign-up-para">Already got an account? <a className="sign-up-button" href="/Login">Log In</a></p>
                </React.Fragment>
            )
        } else {
            return(
                <div>
                    <div className="forgot-password-success">
                        <h3 className="bold primary-color">Reset Token Expired</h3>
                        <p className="p-color">Please request new password reset.</p>
                    </div>
                    <i className="fas fa-4x absolute-center fa-times-circle" style={{color: 'red'}}></i>
                </div>

            )
        }
    }

    render() {
        return(
            <div className="reset-password-box">
                {this.validToken()}
            </div>
        )
    }
}

export default withRouter(ForgotPassword);
