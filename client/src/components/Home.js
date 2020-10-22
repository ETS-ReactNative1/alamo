import React, { Component } from 'react';

class Home  extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid home">
                <div className="row align-items-center">
                    <div className="logo-main col-lg-10">
                        alamo
                    </div>
                    <div className="col-lg-1">
                        <button className="primary-btn">Login</button>
                    </div>
                    <div className="col-lg-1">
                        <button className="secondary-btn">Register</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-10 banner-primary">
                        Share the moment.
                        <div className="row">
                            <span className="banner-secondary">Sign Up For Free Today.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
