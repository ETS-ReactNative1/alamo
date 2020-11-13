import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './App.css';
import io from 'socket.io-client'

import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Room from './components/Room';
import Loading from './components/Loading';

function App(props) {
    const socket = io.connect('http://localhost:8080')
    const [isAuth, checkAuthentication] = React.useState([])
    const [isLoading, fetchAuthentication] = React.useState([])

    const checkAuth = async () => {
        fetchAuthentication(true)
        axios.get('/auth/check')
            .then(response => {
                checkAuthentication(response.data)

                setTimeout(() => {
                    fetchAuthentication(false)
                }, 500)

            }) 
            .catch(err => console.log(err))
    }

    React.useEffect(() => {
        socket.emit('online', localStorage.getItem('userId'), (response) => {
            console.log(response)
        });
        checkAuth()
    }, [])

    const changeOnlineStatus = () => {
    }

    if (isLoading) {
        return(
            <div className="App">
                <Loading/>
            </div>
        )
    }

    if (isAuth) {
        return (
        <div className="App">
            <Router>
                <ErrorBoundary>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Dashboard changeOnlineStatus={(props) => { changeOnlineStatus() }}></Dashboard>
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
                        <Home/>
                    </Switch>
                </Router>
            </div>
        )
    } 

}

export default App;
