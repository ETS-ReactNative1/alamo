import React, { Component } from 'react';
import LoginButton from './LoginButton';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid home">
                <nav className="navbar justify-content-between">
                    <a className="logo-main">alamo</a>
                    <LoginButton></LoginButton>
                </nav>
                <div className="row">
                    <div className="col-lg-10 banner-primary">
                        Share the moment.
                        <div className="row">
                            <span className="banner-secondary">Sign Up For Free Today.</span>
                        </div>
                    </div>
                </div>
                <div className="row register-btn">
                    <div className="col">
                        <button className="secondary-btn">Register</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
