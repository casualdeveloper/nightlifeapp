import React,{Component} from "react"
import {BrowserRouter as Router,Route,Link} from "react-router-dom"

import About from "./About.jsx";

export default class App extends Component {
    _handleClick () {
        alert("THANK YOU!");
    }
    render () {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/topics">Topics</Link></li>
                    </ul>

                    <hr/>

                    <Route path="/about" component={About}/>
                </div>
            </Router>
        );
    }
}
