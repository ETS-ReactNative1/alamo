import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showLogin: false,
            errorMessage: ''
        }
    }

    componentDidMount() {
        //If user is already logged in, redirect to home
        axios.get('/auth/check')
            .then((response) => {
                if (response.data.auth)
                    this.redirect('/')
                else
                    this.setState({showLogin: true})
            })
    }

    redirect = (path) => {
        this.props.history.push(path)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let email = event.target.email.value;
        let password = event.target.password.value;
        let userData = {email, password}

        axios.post('/auth/login', userData)
            .then((response) => {
                if (response.status === 200) {
                    window.location.assign('/')
               } else if (response.status === 400) {

               }
            })
            .catch((err) => this.setState({errorMessage: 'Incorrect email or password.'}))
    }

    loginForm = () => {
         if (this.state.showLogin)
            return(
                <div className="login-box">
                    <h1 className="login-logo centered margin-bottom">alamo</h1>
                    <p className="login-details-para">Please login to your <span style={{fontWeight: '700'}}>alamo</span> account to continue</p>
                    <form className="login-form" action="POST" onSubmit={this.handleSubmit}>
                        <input className="login-input" type="text" name="email" placeholder="Email Address"/>
                        <input className="login-input" type="password" name="password" placeholder="Password"/>
                        <button className="primary-btn login-button" type="submit">Login</button>
                    </form>
                    {this.state.errorMessage.length > 0 ? 
                        <div className="login-error-box">
                            <h6 className="login-error-message">{this.state.errorMessage}</h6>
                        </div> :
                        null
                    }
                    <p className="sign-up-para">No account? <a className="sign-up-button" href="/sign-up">Sign Up</a></p>

                    {this.state.errorMessage.length > 0 ? <p className="sign-up-para" style={{bottom: '65px'}}>Forgot Password? <a className="sign-up-button" href="/reset-password">Reset</a></p> : null}
                </div>
           )
    }


    render() {
        return(
            <React.Fragment>
                {this.loginForm()}
            </React.Fragment>
        )
    }
}

export default withRouter(Login);
