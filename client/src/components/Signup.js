import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import NiceInputPassword from 'react-nice-input-password';
import 'react-nice-input-password/dist/react-nice-input-password.css';

class Signup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showSignup: false,
            email: '',
            password: '',
            confirmationPassword: '',
            errorMessage: '',
            passMatch: ''
        }
    }

    componentDidMount() {
        //If user is already logged in, redirect to home
        axios.get('/auth/check')
            .then((response) => {
                if (response.data.auth)
                    this.redirect('/')
                else
                    return this.setState({showSignup: true})
            })
    }

    redirect = (path) => {
        this.props.history.push(path)
    }

    handlePasswordChange = (data) => {
        this.setState({password: data.value, isValid: data.isValid})
    }

    handleConfirmationPasswordChange = (event) => {
        this.setState({confirmationPassword: event.currentTarget.value})
    }

    handleEmailChange = (event) => {
        this.setState({email: event.currentTarget.value})
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

    signupForm = () => {
        if (this.state.showSignup)
            return(
                <div className="signup-box">
                    <h1 className="login-logo centered margin-bottom">alamo</h1>
                    <p className="login-details-para">Share the moment by creating your <span style={{fontWeight: '700'}}>alamo</span> account</p>
                    <form className="signup-form" action="POST" onSubmit={this.handleSubmit}>
                        <input className="login-input" type="text" name="email" placeholder="Email Address" required onChange={this.handleEmailChange}/>
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
                        <button className="primary-btn login-button" type="submit">Sign Up</button>
                    </form>
                    {(this.state.errorMessage.length > 0 || this.state.passMatch.length > 0) ? 
                        <div className="signup-error-box">
                            <h6 className="login-error-message">{this.state.errorMessage}{this.state.passMatch}</h6>
                        </div> :
                        null
                    }
                    <p className="sign-up-para">Already got an account? <a className="sign-up-button" href="/Login">Log In</a></p>
                </div>
            )
    }

    render() {
        return(
            <React.Fragment>
                {this.signupForm()}
            </React.Fragment>
        )
    }
}

export default withRouter(Signup);
