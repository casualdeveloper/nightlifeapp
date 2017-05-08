import React from "react"
import {BrowserRouter as Router,Route,Link, Switch} from "react-router-dom"

import About from "./About.jsx";
import Home from "./Home.jsx";
import FullCard, {Modal as FullCardModal} from "./FullCard.jsx";

class Routes extends React.Component {
    render () {
        const isModal = (this.props.location.state && this.props.location.state.modal && this.props.history.action !== "POP");
        return (
            <div>
                <Route component={FullCardModal} />
                <Switch location={(isModal)?this.props.location.state.from:this.props.location}>
                    <Route exact path="/" component={Home}/>
                    <Route path="/:id" component={FullCard}/>
                </Switch>
            </div>
        );
    }
}

const App = () => (
    <Router>
        <Route component={Routes} />
    </Router>
) 

export default App;
