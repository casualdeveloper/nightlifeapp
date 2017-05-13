import React from "react";

export default class GoingButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        //going - value for amount of people that are going
        //if no counter is found in business obj we simply set going to default value (0)
        this.state.going = (props.counter)?props.counter:"0";
        this._imGoing = this._imGoing.bind(this);
    }
    _imGoing(e){
        $.ajax({
            method:"POST",
            url:"/api/business/increment",
            data:{id:this.props.id}
        }).always((data)=>{
            this.setState({going:data.counter});
            console.log(data);
        });
    }
    render(){
        return(
            <div>
                <button className="btn btn-primary mb-2" data-imgoing-button="true" onClick={this._imGoing}>Im going</button>
                <p className="card-text"><small className="text-muted">{this.state.going} Going</small></p>
            </div>
        );
    }

}