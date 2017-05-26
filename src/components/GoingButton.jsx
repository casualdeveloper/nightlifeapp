import React from "react";
import {Link} from "react-router-dom";
import {addNotification} from "./Notification.jsx";

const findBusinessInUser=(businessId=>{
    const user = window.user;
    businessId = encodeURI(businessId);
    if(user){
        for(let i = 0, len = user.goingTo.length;i<len;i++){
            if(businessId === user.goingTo[i]){
                return true;
            }
        }
        return false;
    }
    return false;
});

const pushBusinessToUser = (businessId=>{
    const user = window.user;
    businessId = encodeURI(businessId);

    user.goingTo.push(businessId);
});


const removeBusinessFromUser = (businessId=>{
    const user = window.user;
    businessId = encodeURI(businessId);

    let index = user.goingTo.indexOf(businessId);
    if(index !== -1){
        user.goingTo.splice(index,1);
    }
});

export default class GoingButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        //going - value for amount of people that are going
        //if no counter is found in business obj we simply set going to default value (0)
        this.state.going = (props.counter && props.counter>=0)?props.counter:"0";
        this._imGoing = this._imGoing.bind(this);
        this.state.isUserGoing = findBusinessInUser(props.id);
    }
    _imGoing(e){
        const user = window.user;
        if(!user){
            //redirect for auth
            let lastSearched = (this.props.search)?this.props.search:null;
            return window.location.href = "/auth/"+lastSearched;
        }
        if(!this.state.isUserGoing){
            // if user is not going 
            $.ajax({
                method:"POST",
                url:"/api/business/increment",
                data:{id:this.props.id}
            }).done((data)=>{
                this.setState({going:data.counter,isUserGoing:true});
                pushBusinessToUser(this.props.id);
            });
        }else{
            //if user is already going and clicked button once again
            $.ajax({
                method:"POST",
                url:"/api/business/decrement",
                data:{id:this.props.id}
            }).done((data)=>{
                this.setState({going:data.counter,isUserGoing:false});
                removeBusinessFromUser(this.props.id);
            });
        }
        
    }
    _isUserGoing(){
        const user = window.user;
        const going = " Already going";
        const notGoing = "I'm going";
        if(this.state.isUserGoing){
            return going;
        }
        return notGoing;
    }
    render(){
        const imGoingButtonText = this._isUserGoing();
        return(
            <div className="d-flex justify-content-start">
                <div>
                    <button className="btn custom-button mb-2" data-nomodal="true" onClick={this._imGoing}>
                        {(this.state.isUserGoing)?<i className="fa fa-check" data-nomodal="true" aria-hidden="true"></i>:null}
                        {imGoingButtonText}
                    </button>
                    <p className="card-text"><small className="text-muted">{this.state.going} Going</small></p>
                </div>
                <Link to={this.props.url} target="_blank" data-nomodal="true" className="ml-auto btn yelp-button"><i className="fa fa-yelp fa-2x " data-nomodal="true" aria-hidden="true"></i></Link>
            </div>
        );
    }

}