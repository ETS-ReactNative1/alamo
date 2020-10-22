import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './components/Home';

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route path="/"><Home/></Route>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
