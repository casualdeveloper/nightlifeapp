import React from "react";

import { Link } from "react-router-dom";

import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import GoingButton from "./GoingButton.jsx";
import {addNotification} from "./Notification.jsx";

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


        //check if user is logged in
        //if so automatically search        
        if(window.user){
            if(window.user.lastSearched !== ""){
                this.searchInput.value = window.user.lastSearched;
                this._handleSearch();
            }
        }
    }

    _handleSearch(e){
        if(e){
            e.preventDefault();
        }
        let searchingFor = this.searchInput.value;
        //check for spaces
        if(searchingFor.trim() === ""){
            return addNotification({type:"error",message:"Search field must be filled"});
        }
        //for loading screen
        this.setState({data:null,search:searchingFor});
        $.ajax({
            url: "/api/search",
            method: "POST",
            data:{str:searchingFor}
        }).done((data)=>{ 
            this.setState({data:data});
        });
    }

    whatShouldRender(){
        //check if searched anything (to prevent loading animation if no search has been done)
        if(!this.state || this.state.search === null){
            return null;
        }
        //check if loading
        if(this.state.data === null){
            return (<Loading />);
        }
        //check for error
        //if(this.state.data.error){
        //    return (<ErrorMessage message={this.state.data.error} />);
        //}
        //render content if everything else is OK.
        return (<Cards search={this.searchInput.value} data={this.state.data} history={this.props.history} location={this.props.location}/>);
    }

    render(){
        const content = this.whatShouldRender();

        return(
            <div className="container">
                <h1 className="text-center mb-4" >Nightlife coordination app</h1>
                {/* search */}
                <div className="w-50 mx-auto">
                    <form>
                    <div className="input-group">
                    <input id="home-search" type="text" className="form-control" placeholder="Search for..."/>
                        <span className="input-group-btn">
                            <button className="btn btn-secondary" type="submit" onClick={this._handleSearch}>Go!</button>
                        </span>
                    </div>
                    </form>
                </div>
                {/* content */}
                <hr/>
                {content}
            </div>
        );
    }
}

const Cards = (props) =>{
    let going = (!props.data.counter)?"0":props.data.counter;

    const businesses = props.data.businesses;
    const list = businesses.map((data, i)=>{
        return <Card  {...props} data={data} key={i} />
    });
    return (<div className="card-columns">{list}</div>);
}

class Card extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this._click = this._click.bind(this);
    }
    _click(e){
        let target = $(e.target);
        //prevent modal showing up if user clicks on specific items like link or "Im going" button (don't forget to add data-nomodal attribute to these items)
        if(target.data("nomodal")){
            return;
        }
        this.props.history.replace(this.props.data.id,{modal:true,from:this.props.location});
        $("#businessModal").modal("show");
    }
    render(){
        return (
            <div className="card home-card" onClick={this._click}>
                <img className="card-img-top img-fluid" src={this.props.data.image_url} alt="Card image cap" />
                <div className="card-block">
                    <Link className="title-link" to={this.props.data.id} target="_blank"><h4 className="card-title" data-nomodal="true">{this.props.data.name}</h4></Link>
                    <GoingButton search={this.props.search} counter={this.props.data.counter} id={this.props.data.id} history={this.props.history} url={this.props.data.url}/>
                </div>
            </div>
        );
    }
}
