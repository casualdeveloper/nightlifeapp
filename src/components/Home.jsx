import React from "react";

import { Link } from "react-router-dom";

import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.state.search = null;
        //setting data to null for loading sreen to render
        this.state.data = null;
        this._handleSearch = this._handleSearch.bind(this);

        //will be used as input ref
        this.searchInput;
    }

    componentDidMount(){
        //ref to input
        this.searchInput = $("#home-search")[0];
    }

    _handleSearch(){
        let searchingFor = this.searchInput.value
        console.log(searchingFor);
        //for loading screen
        this.setState({data:null,search:searchingFor});
        $.ajax({
            url: "/api/search",
            method: "POST",
            data:{str:searchingFor}
        }).always((data)=>{ 
            this.setState({data:data});
        });
    }

    whatShouldRender(){
        if(!this.state){
            return null;
        }
        //check if searched anything (to prevent loading animation if no search has been done)
        if(this.state.search === null){
            return null;
        }
        //check if loading
        if(this.state.data === null){
            return (<Loading />);
        }
        //check for error
        if(this.state.data.error){
            return (<ErrorMessage message={this.state.data.error} />);
        }
        //render content if everything else is OK.
        return (<Cards data={this.state.data} history={this.props.history} location={this.props.location}/>);
    }

    render(){
        const content = this.whatShouldRender();

        return(
            <div className="container">
                <h1 className="text-center mb-3" >HOME :))</h1>
                {/* serach */}
                <div className="w-50 mx-auto">
                    <div className="input-group">
                    <input id="home-search" type="text" className="form-control" placeholder="Search for..."/>
                        <span className="input-group-btn">
                            <button className="btn btn-secondary" type="button" onClick={this._handleSearch}>Go!</button>
                        </span>
                    </div>
                </div>
                {/* content */}
                <hr/>
                {content}
            </div>
        );
    }
}

const Cards = (props) =>{
    console.log(props);
    const businesses = props.data.businesses;
    const list = businesses.map((data, id)=>{
        return <Card name={data.name} img={data.image_url} price={data.price} rating={data.rating} id={data.id} key={id} history={props.history} location={props.location} />
    });
    return (<div className="card-columns">{list}</div>);
}

const Card = (props) =>{
    const _click = (e)=>{
        let target = $(e.target);
        //prevent modal showing up if user clicks on title link or "im Going" button
        if(target.data("link") || target.data("imgoingButton")){
            return;
        }

        props.history.replace(props.id,{modal:true,from:props.location});
        $("#businessModal").modal("show");
    }
    const _imGoing = (e) =>{
        console.log("im GOING !");
    }
    return (
        <div className="card home-card" onClick={_click}>
            <img className="card-img-top img-fluid" src={props.img} alt="Card image cap" />
            <div className="card-block">
                <Link className="title-link" to={props.id}><h4 className="card-title" data-link="true">{props.name}</h4></Link>
                <button className="btn btn-primary mb-2" data-imgoing-button="true" onClick={_imGoing}>Im going</button>
                <p className="card-text"><small className="text-muted">0 Going</small></p>
            </div>
        </div>
    );
}
