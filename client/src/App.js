import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client'

import Home from './components/Home';
import ProfileSetup from './components/ProfileSetup';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Room from './components/Room';
import Loading from './components/Loading';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

const socket = io('http://localhost:8080', {
    reconnection: true,
    reconnectionDelay: 3000,
    reconnectionAttempts: 20,
    forceNew: true

});

function App(props) {
    const [isAuth, checkAuthentication] = React.useState([])
    const [isLoading, pageLoading] = React.useState([])
    const [accountSetup, checkAccountSetup] = React.useState([])
    const [user, fetchUser] = React.useState([])

    //Fetch all information related to user
    const fetchUserInformation = () => {
        axios.get('/auth/user')
            .then((response) => {
                fetchUser(response.data.user)
            })
    }

    const checkAuth = async () => {
        pageLoading(true)
        axios.get('/auth/check')
            .then(response => {
                const auth = response.data.auth;
                checkAuthentication(auth)
                return response.data.user
            }) 
            .then((user) => {
                pageLoading(false)
                if (isAuth) {
                    checkAccountSetup(user.account_setup)
                    fetchUser(user)
                    //Store userId (user primary key) on client side for ease of access throughout application
                    localStorage.setItem('userId', user._id)                

                    if (user.account_setup) {
                        changeOnlineStatus(user);
                    }
                } 
            })
            .catch(err => console.log(err))
    }

    const changeOnlineStatus = (user) => {
        socket.emit('online', localStorage.getItem('userId'), (response) => {
            pageLoading(false)
        })        
    }

    React.useEffect(() => {
        window.addEventListener("beforeunload", function(event) { 
            socket.emit('user-offline', localStorage.getItem('userId'))
        });

        checkAuth()
    }, [])

    if (accountSetup === false) {
        return(
            <ProfileSetup user={user}/>
        )
    }

    if (isLoading) {
        return(
            <Loading/>
        )
    }

    if (isAuth && accountSetup) {
        return (
            <div className="App">
                <Router>
                    <ErrorBoundary>
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Dashboard socket={socket} auth={isAuth} user={user} fetchUserInformation={() => fetchUserInformation()} changeOnlineStatus={(props) => { changeOnlineStatus() }}></Dashboard>
                        </Switch>
                    </ErrorBoundary>
                </Router>
            </div>
      );
    } else {
        return(
            <div className="App">
                <Router>
                    <Switch>
                        <Route path="/login" component={Login} exact/>
                        <Route path="/sign-up" component={Signup} exact/>
                        <Route path="/reset-password" component={ForgotPassword} exact/>
                        <Route path="/reset" component={ResetPassword}/>
                        <Home/>
                    </Switch>
                </Router>
            </div>
        )
    } 

}

export default App;
