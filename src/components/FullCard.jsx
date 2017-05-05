import React from "react";

export default class FullCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.state.data = null;
    }
    componentDidMount(){
        $.ajax({
            url: "/api/business/"+this.props.match.params.id,
            method: "GET",
            headers:{
                "data_fetch": "true"
            }
        }).always((data)=>{ 
            console.log(data);
            this.setState({data:data});
        });
    }
    render(){
        const loading = this.state.data === null;
        return(
            <div>
                {(loading)?(<h1 className="text-center">Loading </h1>):(<Card data={this.state.data} />)}
                
            </div>
        );
    }
}

const Card = (props)=>{
    return(
        <div className="container w-75">
            <div className="card">
                <img className="card-img-top img-fluid" src={props.data.image_url} alt="Card image cap" />
                <div className="card-block">
                    <h1 className="text-center">{props.data.name}</h1>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
    );
    
}