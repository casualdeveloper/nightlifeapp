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
        <div id="businessSlides" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                <li data-target="#businessSlides" data-slide-to="0" className="active"></li>
                <li data-target="#businessSlides" data-slide-to="1"></li>
                <li data-target="#businessSlides" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner" role="listbox">
                <div className="carousel-item justify-content-around active ">
                    <img className="d-block img-fluid" src={props.img1} alt="First slide" />
                </div>
                <div className="carousel-item justify-content-around">
                    <img className="d-block img-fluid" src={props.img2} alt="Second slide" />
                </div>
                <div className="carousel-item justify-content-around">
                    <img className="d-block img-fluid" src={props.img3} alt="Third slide" />
                </div>
            </div>
            <a className="carousel-control-prev" href="#businessSlides" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#businessSlides" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    );

    
}