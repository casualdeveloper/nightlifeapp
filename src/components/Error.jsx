import React from "react";

export default class Error extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.state.message = props.message;
    }
    render(){
        return(
            <div className="container text-center">
                {(this.state.message)
                    ?(<h2>{this.state.message}</h2>)
                    :(<h2>Something went wrong, please try again later...</h2>)
                }
            </div>
        );
    }
}