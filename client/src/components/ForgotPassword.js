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
            isLoading: false,
            requestSuccess: false,
            errorMessage: '',
        }
    }

    requestToken = (event) => {
        this.setState({isLoading: true})
        event.preventDefault();
        let email = event.target.email.value

        axios.post('/auth/request-password-reset-token', {email: email})
            .then((response) => {
                this.setState({requestSuccess: true})
                console.log(response)
            })
            .catch((err) => console.log(err))
    }

    success = () => {
        if (this.state.requestSuccess)
            return(
                <div>
                    <div className="forgot-password-success">
                        <h3 className="bold primary-color">Password Reset Sent</h3>
                        <p className="p-color">Please check your email.</p>
                    </div>
                    <i className="fas fa-3x absolute-center primary-color fa-check-circle"></i>
                </div>
            )
    }

    requestTokenForm = () => {
        if (!this.state.requestSuccess)
            return(
                <React.Fragment>
                    {this.state.isLoading ? <Loading/>: null}

                    <h1 className="login-logo centered margin-bottom">alamo</h1>
                    <p className="password-para">Please enter your email address</p>
                    <form className="signup-form" action="POST" onSubmit={this.requestToken} style={{marginTop: '15px'}}>
                        <input className="login-input" type="text" name="email" placeholder="Email Address" required/>
                        <button className={this.state.isLoading ? "primary-btn login-button disabled" : "primary-btn login-button"} type="submit">Submit</button>
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
    }

    render() {
        return(
            <div className="forgot-password-box">
                {this.requestTokenForm()}
                {this.success()}
            </div>
        )
    }
}

export default withRouter(ForgotPassword);
