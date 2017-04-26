var React = require("react");

module.exports = React.createClass({
    _handleClick: function(){
        alert("THANK YOU!");
    },
    render: function() {
        return (
            <html>
                <head>
                    <title>THE MOST AMAZING WEB APP YOU WILL EVER SEE!!!</title>
                    <link rel="stylesheet" href="/style.css" />
                </head>
                <body>
                    <div>
                        <h1> HELLO :))) ASD ASD </h1>
                        <button onClick={this._handleClick}>PUSH ME PLEEEAAASEEE :)</button>
                    </div>
                    <script src="/bundle.js" />
                </body>
            </html>
            
        );
    }
});