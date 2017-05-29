import React from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

const hashKey = () =>{
    return "_"+(Math.random().toString(36).substring(0,9));
}

let initializeGlobalAjaxErrorHandling = () =>{
    $( document ).ajaxError((e,request,settings,errorText)=>{
        message = request.responseText || request.statusText;
        addNotification({type:"error",message:message});
    });
}

export let addNotification = (cb,obj) =>{
    cb(obj);
}

export default class Notification extends React.Component {
    constructor(props){
        super(props);
        this.state={messages:[]};
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        addNotification = addNotification.bind(null,this.addItem);
        this.limit = this.props.limit;
        if(props.globalAjaxErrorHandling){
            initializeGlobalAjaxErrorHandling();
        }
    }

    removeItem(id) {
        this.setState((prevState) => ({
            messages: prevState.messages.filter((obj) => obj.id !== id)
        }));
    }
    
    addItem(obj) {
        if(this.limit && this.state.messages.length >= this.limit){
            this.removeItem(this.state.messages[0].id);
        }

        obj.id = hashKey();

        this.setState((prevState)=>({
            messages: prevState.messages.concat(obj)
        }));
    }
    render(){
        const pushMessage = (obj) =>{
            this.addItem(obj);
        }   
        return (
            <div className="notification-container text-center">
                <CSSTransitionGroup
                    transitionName="notification"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}>
                        {this.state.messages.map((obj,i)=>{
                            return <NotificationCard key={obj.id} obj={obj} clickHandler={()=>{this.removeItem(obj.id)}} />;
                        })}
                </CSSTransitionGroup>
            </div>
        );
    }
}

class NotificationCard extends React.Component{
    constructor(props){
        super(props);
        this._timeOut;
        this.removeHandler = this.removeHandler.bind(this);
        this.removing = false;
    }

    componentDidMount(){
        this._timeOut=setTimeout(()=>{
            this.removeHandler();
        },5000);
    }

    removeHandler(e){
        if(this.removing)
            return;    
        
        this.removing = true;
        clearTimeout(this._timeOut);
        this.props.clickHandler();
    }

    render(){
        return(
            <div className="notification-popup-wrapper mb-2">
                <div onClick={this.removeHandler} className="notification-popup">
                    {this.props.obj.message}
                </div>
                <NotificationProgress obj={this.props.obj} />
            </div>  
        );
    }
}

class NotificationProgress extends React.Component{
    render(){
        return(
            <div className="notification-progress">
                <CSSTransitionGroup 
                    transitionName="notification-progress"
                    transitionAppear={true}
                    transitionAppearTimeout={5000}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <div key={this.props.obj.id} className={"notification-progress-bar "+this.props.obj.type}></div>
                </CSSTransitionGroup>
            </div>
        );
    }
}