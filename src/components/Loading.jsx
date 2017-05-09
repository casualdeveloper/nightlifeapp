import React from "react";

export default class Loading extends React.Component{
    render(){
        return(
            <div className="text-center">
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }
}