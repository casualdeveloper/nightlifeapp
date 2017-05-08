import React from "react";

import { Link } from "react-router-dom";

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.state.data = null;
    }

    componentDidMount(){
        $.ajax({
            url: "/api/search",
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
            <div className="container">
                <h1 className="text-center" >HOME :))</h1>
                <hr/>
                { loading?(<h3>LOADING...</h3>):(<Cards data={this.state.data} history={this.props.history} location={this.props.location}/>)}
            </div>
        );
    }
}

const Cards = (props) =>{
    const businesses = props.data.businesses;
    const list = businesses.map((data, id)=>{
        return <Card name={data.name} img={data.image_url} price={data.price} rating={data.rating} id={data.id} key={id} history={props.history} location={props.location} />
    });
    return (<div className="card-columns">{list}</div>);
}

const Card = (props) =>{
    const _click = ()=>{
        props.history.replace(props.id,{modal:true,from:props.location});
        $("#businessModal").modal("show");
        
    }
    return (
        <div className="card home-card" onClick={_click}>
            <div className="home-card-tint"></div>
            <img className="card-img-top img-fluid" src={props.img} alt="Card image cap" />
            <div className="card-block">
                <h4 className="card-title">{props.name}</h4>
                <button className="btn btn-primary">Im going</button>
                <p className="card-text"><small className="text-muted">0 Going</small></p>
            </div>
        </div>
    );
}
