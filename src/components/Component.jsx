import React from "react";

class Component extends React.Component{
    _handleClick () {
        alert("THANK YOU!");
    }
    render () {
        return (
            <div>
                <h1>
                    HELLO :))) ASD ASD
                </h1>
                <button onClick={this._handleClick}>PUSH ME PLEEEAAASEEE :)</button>
            </div>
        );
    }
}

export {Component};