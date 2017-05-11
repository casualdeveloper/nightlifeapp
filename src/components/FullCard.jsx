import React from "react";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

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
                {(loading)?(<Loading />)
                    :(this.state.data.error)
                        ?(<ErrorMessage message={this.state.data.error} />)
                        :(<Card data={this.state.data} />)
                }    
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
            //setting data to null to render loading component and erase carousel
            //otherwise carousel will stay and if user decides to go to the full page ids of carousels will interac with each other
            //making carousel on full page not working correctly
            //plus when loading other modal user immediately will get loading screen. (2 birds 1 shot??????)
            this.setState({data:null});
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
                        {(loading)?(<Loading />)
                            :(this.state.data.error)
                                ?(<ErrorMessage message={this.state.data.error} />)
                                :(<Card data={this.state.data} modal={true} />)
                        } 
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
        <div className="container">
            <div className="card full-card">
                <Carousel img1={props.data.photos[0]} img2={props.data.photos[1]} img3={props.data.photos[2]} />
                <div className="card-block">
                    <h1 className="text-center">{props.data.name}</h1>
                    <Reviews modal={props.modal} reviews={props.data.reviews} />
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

const Reviews = (props) =>{
    let reviews = props.reviews;
    if(props.modal){
        reviews = reviews.splice(0,1);
    }
    return(
        <div className="reviews">
            {reviews.map((obj,i)=>{
                //date apie yelp api is returned as 2017-05-10 09:24:16
                //since we don't need hrs, mins and secs we split at " " <-- space
                //and pick the first part of date
                const date = obj.time_created.split(" ")[0].toString();
                return (
                    <div key={i}>
                        <div className="card card-outline-secondary mb-3 text-center card-comment" >
                            <div className="card-block">
                                <blockquote className="card-blockquote">
                                <p>{obj.text}</p>
                                <footer><cite title="Source Title">{obj.user.name} - {date}</cite></footer>
                                </blockquote>
                            </div>
                        </div>
                        {(i!==reviews.length-1)?<hr/>:null}
                    </div>
                );
            })}
            
        </div>
    );
} 