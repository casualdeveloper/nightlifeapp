import React from "react";
import Loading from "./Loading.jsx";

export default class FullCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        //setting data to null for loading screen to render
        this.state.data = null;
    }

    componentDidMount(){
        $.ajax({
            url: "/api/business/"+this.props.match.params.id,
            method: "GET"
        }).always((data)=>{ 
            console.log(data);
            this.setState({data:data});
        });
    }
    render(){
        const loading = this.state.data === null;

        return(
            <div>
                {(loading)?(<Loading />):(<Card data={this.state.data} />)}       
            </div>
        );
    }
}

export class Modal extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        this.state.data = null;
    }
    componentWillReceiveProps(nextProps){
        //Avoiding new request to server and rerender if the same modal or full page is accessed 
        const shouldUpdate = !!((nextProps.location.pathname !== this.props.location.pathname) 
        && (nextProps.location.state && nextProps.location.state.modal));
        if(!shouldUpdate)
            return;

        //for loading screen to render we set data to null
        this.setState({data:null});
        
        $.ajax({
            url: "/api/business"+nextProps.location.pathname,
            method: "GET"
        }).always((data)=>{ 
            console.log(data);
            this.setState({data:data});
        });
    }
    componentDidMount(){
        // reseting url to our homepage once modal is dismissed
        $("#businessModal").on("hidden.bs.modal",()=>{
            this.props.history.replace("/");
        });
    }
    render(){
        const loading = this.state.data === null;
        return(
            <div className="modal fade" id="businessModal" tabIndex="-1" role="dialog" aria-labelledby="business" aria-hidden="true">
                <div className="modal-dialog-custom modal-dialog " role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button className="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {(loading)?(<Loading />):(<Card data={this.state.data} />)} 
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Card = (props)=>{
    return(
        <div className="container w-75">
            <div className="card full-card">
                <Carousel img1={props.data.photos[0]} img2={props.data.photos[1]} img3={props.data.photos[2]} />
                <div className="card-block">
                    <h1 className="text-center">{props.data.name}</h1>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
    );
}

const Carousel = (props) =>{
    return(
        <div id="businessSlides" className="carousel" data-ride="carousel">
            <ol className="carousel-indicators">
                <li data-target="#businessSlides" data-slide-to="0" className="active"></li>
                <li data-target="#businessSlides" data-slide-to="1"></li>
                <li data-target="#businessSlides" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner" role="listbox">
                <div className="carousel-item active ">
                    <img className="d-block img-fluid img-fluid-custom-settings" src={props.img1} alt="First slide" />
                </div>
                <div className="carousel-item ">
                    <img className="d-block img-fluid img-fluid-custom-settings" src={props.img2} alt="Second slide" />
                </div>
                <div className="carousel-item ">
                    <img className="d-block img-fluid img-fluid-custom-settings" src={props.img3} alt="Third slide" />
                </div>
            </div>
            <button className="carousel-control-prev carousel-control-button" data-target="#businessSlides" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </button>
            <button className="carousel-control-next carousel-control-button" data-target="#businessSlides" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </button>
        </div>
    );
}