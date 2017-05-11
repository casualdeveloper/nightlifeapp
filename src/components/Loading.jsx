import React from "react";

export default class Loading extends React.Component{
    render(){
        return(
            <div className="text-center">
                <h3>Loading...</h3>
                <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
            </div>
        );
    }
}