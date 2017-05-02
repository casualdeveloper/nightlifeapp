import React from "react"
import {BrowserRouter as Router,Route,Link} from "react-router-dom"

import About from "./About.jsx";
import Home from "./Home.jsx";

export default class App extends React.Component {
    _handleClick () {
        alert("THANK YOU!");
    }
    render () {
        return (
            <Router>
                <div>
                    <Route path="/" component={Home}/>
                </div>
            </Router>
        );
    }
}
