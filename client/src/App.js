import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Room from './components/Room';
import Loading from './components/Loading';

function App() {
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
        return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Dashboard></Dashboard>
                    </Route>

                    <Route path="/room/">
                        <Room/>
                        <Dashboard></Dashboard>
                    </Route>
                </Switch>
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
