import React from "react"
import {BrowserRouter as Router,Route,Link, Switch} from "react-router-dom"

import About from "./About.jsx";
import Home from "./Home.jsx";
import FullCard from "./FullCard.jsx";

export default class App extends React.Component {
    _handleClick () {
        alert("THANK YOU!");
    }
    render () {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/:id" component={FullCard} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
