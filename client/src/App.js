import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import io from 'socket.io-client'


import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Room from './components/Room';
import Loading from './components/Loading';

function App() {
    const socket = io.connect('http://localhost:8080')

    const { isAuthenticated, isLoading } = useAuth0();

    console.log(isAuthenticated)

    if (isLoading) {
        return(
            <div className="App">
                <Loading/>
            </div>
        )
    }

    if (isAuthenticated) {
        socket.emit('online', localStorage.getItem('userId'));

        return (
        <div className="App">
            <Router>
                <Dashboard></Dashboard>
            </Router>
        </div>
      );
    } else {
        return(
            <div className="App">
                <Home/>
            </div>
        )
    } 

}

export default App;
