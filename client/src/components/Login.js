import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            login: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let email = event.target.email.value;
        let password = event.target.password.value;

        let userData = {email, password}

        axios.post('/auth/register_login', userData)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => console.log(err))
    }

    checkLogin = () => {
        axios.get('/auth/check')
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return(
            <div>
                <form action="POST" onSubmit={this.handleSubmit}>
                    <input type="text" name="email" placeholder="email"/>
                    <input type="password" name="password" placeholder="password"/>
                    <button type="submit">login</button>
                </form>
                <button onClick={this.checkLogin}>chech login status</button>
            </div>
        )
    }
}

export default Login;
