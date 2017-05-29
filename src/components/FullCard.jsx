import React from "react";
import Loading from "./Loading.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import {Link} from "react-router-dom";
import GoingButton from "./GoingButton.jsx";


const getCurrentTimeInSeconds = () =>{
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }
    return Math.floor(Date.now() / 1000);
}

const _24HoursInSeconds = 24 * 60 * 60;

const isExpired = (timestamp, expirationTime) => {
    const currTime = getCurrentTimeInSeconds();
    if(currTime - timestamp>expirationTime){
        return true;//expired;
    }
    return false;
}

const checkIfLocalStorageAvailable = () =>{
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
    } catch(e) {
        return false;
    }
}

const localStorageIsAvailable = checkIfLocalStorageAvailable();

const validateAndParseData = (obj) => {
    try{
        let data = JSON.parse(obj);
        return data;
    }catch(e){
        return false;
    }
}

//id as business id.
const getFromCache = (id) =>{
    if(!localStorageIsAvailable){
        return null;
    }
    let data = localStorage.getItem(id);
    if(data = validateAndParseData(data)){
        // if timestamp exists and data hasn't expired (24hrs for expiration due to yelp api requirements) return data
        if(data.timestamp && !isExpired(data.timestamp,_24HoursInSeconds)){
            return data;
        }
        return null;
    }
    return null;
}
const addToCache = (id,data) =>{
    
    //get and add current date in seconds
    data.timestamp = getCurrentTimeInSeconds();

    localStorage.setItem(id,JSON.stringify(data));
}



const fetchData = (id) =>{
    return new Promise((resolve,reject)=>{
        let data;
        //search for data in cache
        //if found retrieve and update counter variable - (amount of people that are going to event...)
        if(data = getFromCache(id)){
            $.ajax({
                url: "/api/business/counter/"+id,
                method: "GET"
            }).done((counterObj)=>{ 
                console.log(counterObj);
                console.log(id);
                data.counter = counterObj.counter;
                resolve(data);
            });
        }else{
            //if no data was found in cache retrieve it from server 
            $.ajax({
                url: "/api/business/"+id,
                method: "GET"
            }).done((data)=>{ 
                addToCache(id,data);
                resolve(data);
            });
        }

        
    });
    
}

export default class FullCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        //setting data to null for loading screen to render
        this.state.data = null;
    }

    componentDidMount(){
        fetchData(this.props.match.params.id)
            .then(data=>{
                this.setState({data:data});
            });
        
    }
    whatShouldRender(){
        if(!this.state){
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
        return (<Card data={this.state.data} />);
    }
    render(){
        const content = this.whatShouldRender();

        return(
            <div>
                {content}
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

        //Avoiding render if accessing full page not a modal
        const shouldUpdate = !!(nextProps.location.state && nextProps.location.state.modal);
        if(!shouldUpdate)
            return;
        
        //substring 1 to delete "/" from url ex: "/business-id" ---> "business-id"
        fetchData(nextProps.location.pathname.substring(1))
            .then(data=>{
                this.setState({data:data});
            });

    }
    componentDidMount(){
        // reseting url to our homepage once modal is dismissed
        $("#businessModal").on("hidden.bs.modal",()=>{
            //setting data to null to render loading component and erase carousel
            //otherwise carousel will stay and if user decides to go to the full page ids of carousels will interact with each other
            //making carousel on full page not working correctly
            //plus when loading other modal user immediately will get loading screen.
            this.setState({data:null});
            this.props.history.replace("/");
        });
    }
    whatShouldRender(){
        if(!this.state){
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
        return (<Card data={this.state.data} modal={true}/>);
    }
    render(){
        const content = this.whatShouldRender();
        return(
            <div className="modal fade" id="businessModal" tabIndex="-1" role="dialog" aria-labelledby="business" aria-hidden="true">
                <div className="modal-dialog-custom modal-dialog " role="document">
                    <div className="modal-content custom-modal">
                        <div className="modal-body">
                            {content}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn custom-button" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Card = (props)=>{
    return(
        <div className="container mb-5">
            <div className="card full-card">
                {(props.modal)?(<Link className="title-link" to={props.data.id} target="_blank"><h1 className="text-center mb-3">{props.data.name}</h1></Link>):null}
                <Carousel img1={props.data.photos[0]} img2={props.data.photos[1]} img3={props.data.photos[2]} />
                <div className="card-block">
                    {(!props.modal)?(<h1 className="text-center mb-3">{props.data.name}</h1>):null}
                    <Reviews modal={props.modal} reviews={props.data.reviews} />
                    <GoingButton counter={props.data.counter} id={props.data.id} url={props.data.url}/>
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
    let reviews = props.reviews.slice(0);
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