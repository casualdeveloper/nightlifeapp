import React from "react"
import {BrowserRouter as Router,Route,Link, Switch} from "react-router-dom"

import Home from "./Home.jsx";
import FullCard, {Modal as FullCardModal} from "./FullCard.jsx";

//The idea of app is:
//If user clicks on one of the cards in Home page
//  onClick event calls 1.function replace that replaces the current entry in the history stack passing to the state:
//      1.url that is id of business that we use to retrieve more info about it;
//      2.state that has 2 values: 1.modal set to true; 2."from" that is set to current users location (naturally it is going to be "/" - the homepage)
//  2.show modal function;
//otherwise user is redirected by route to /:id location id being business id that will be used to retrieve data about it through props.match.params.id
class Routes extends React.Component {
    render () {
        //check if user is accessing modal or full pag
        const isModal = (this.props.location.state && this.props.location.state.modal && this.props.history.action !== "POP");
        return (
            <div>
                <Route component={FullCardModal} />
                {/* if isModal set to true we are keeping our current location same (avoiding redirect)*/}
                <Switch location={(isModal)?this.props.location.state.from:this.props.location}>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/:id" component={FullCard}/>
                </Switch>
            </div>
        );
    }
}

const App = () => {
    console.log(window.user);
    return(
        <Router>
            <Route component={Routes} />
        </Router>
    );
}

export default App;
