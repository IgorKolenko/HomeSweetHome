import React from 'react';
import 'jquery';
import './listing.scss';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faBed, faBath, faTree, faParking, faTape, faCity, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const MyMapComponent = withScriptjs(withGoogleMap((props) =>{
    console.log("Lat: "+props.lat);
    console.log("Long: "+props.long);
    return(
        <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: props.lat, lng: props.long }}
        >
            {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.long }} />}
        </GoogleMap>
    );
}
))

class Listing extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            imageIDs: [],
            lat: 0,
            long: 0,
            name: "",
            email: "",
            message: ""
        };
        this.nameOnChange = this.nameOnChange.bind(this);
        this.emailOnChange = this.emailOnChange.bind(this);
        this.messageOnChange = this.messageOnChange.bind(this);
        this.sendForm = this.sendForm.bind(this);
    }

    componentDidMount(){
        console.log("Entering componentDidMount");
        toast.configure();
        const { match: { params } } = this.props;
        console.log("fetching listing");
        fetch('http://localhost:5000/get-listing-by-id', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "listingId": params.listingId
            }),
            mode: 'cors',
            credentials: 'include'
        }).then((resp) => resp.json()).then((json) => {
            var imageIDs = json.imageIDs;
            this.setState({
                json: json,
                imageIDs: imageIDs
            });

            var address = json.addr+", "+json.city;
            address = address.replace(/ /g,"%20");
            console.log(address)
            fetch('https://us1.locationiq.com/v1/search.php?key=829734a2c414f5&q='+address+'&format=json', {
                method: 'GET'
            }).then((resp) => resp.json()).then((geojson) => {
                console.log("Geo json: "+JSON.stringify(geojson));
                this.setState({
                    lat: parseFloat(geojson[0].lat),
                    long: parseFloat(geojson[0].lon)
                });

            })
        })
    }

    nameOnChange(t){
        this.setState({
            name: t.target.value
        })
    }

    emailOnChange(t){
        this.setState({
            email: t.target.value
        })
    }

    messageOnChange(t){
        this.setState({
            message: t.target.value
        })
    }

    sendForm(b){
        b.preventDefault();
        fetch('http://localhost:5000/send-mail', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "fromMail": this.state.email,
                "toMail": this.state.json.email,
                "buyerName": this.state.name,
                "message": this.state.message
            }),
            mode: 'cors',
            credentials: 'include'
        }).then((res) => {
            if(res.status == 200){
                NotificationManager.success('Email sent!');
                this.setState({
                    name: "",
                    email: "",
                    message: ""
                })
            }else{
                NotificationManager.error('Error occurred!');
            }
        })
    }

    render(){
        var json = this.state.json;
        var ids = this.state.imageIDs;
        console.log(json);
        var key = -1;
        console.log("Image ids: "+ids);
        var lat = parseFloat(this.state.lat);
        var long = parseFloat(this.state.long);
        if(json != {} && lat != 0 && long != 0){
            return(
                <div id="viewBody">
                    <CarouselProvider class="carousel"
                        naturalSlideWidth={1000}
                        naturalSlideHeight={600}
                        totalSlides={ids.length}
                    >
                        <Slider>
                            {ids.map(function(id){
                                key++;
                                return(<Slide index={key}><img src={'http://localhost:5000/images/'+id} class="sliderimg img-responsive"/></Slide>)
                            })}
                        </Slider>
                        <ButtonBack className="btnClass">Back</ButtonBack>
                        <ButtonNext className="btnClass">Next</ButtonNext>
                    </CarouselProvider>
                    {json.listingType == "sale" ? <h1>${json.price}</h1> : <h1>${json.price}/month</h1>}
                    <p>{json.description}</p>
                    <p class="location"><FontAwesomeIcon icon={faMapMarkedAlt} /> {json.addr+", "+json.city}</p>
                    <MyMapComponent
                    lat={this.state.lat}
                    long={this.state.long}
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `500px` }} />}
                    containerElement={<div style={{ height: `500px` }} />}
                    mapElement={<div style={{ height: `500px`, width: '90%', margin: 'auto' }} />}
                    />
                    <div className="gridContainer">
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faBed} /> Bedrooms: </span>{json.bedrooms}</p>
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faBath} /> Bathrooms: </span>{json.bathrooms}</p>
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faParking} /> Parking spaces: </span>{json.parking}</p>
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faTree} /> Presence of a garden: </span>{json.garden}</p>
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faTape} /> Area size: </span>{json.area} m2</p>
                        <p><span className="listingInfo"><FontAwesomeIcon icon={faCity} /> Proximity to the city center: </span>{json.proximity}</p>
                    </div>
                    <h2>Contact seller</h2>
                    <p><FontAwesomeIcon icon={faPhone} /> Phone number: {json.phone}</p>
                    <p><FontAwesomeIcon icon={faEnvelope} /> Email address: {json.email}</p>
                    <div id="contactForm">
                        <label>Your name</label>
                        <input type="text" name="name" class="form-control" onChange={this.nameOnChange} value={this.state.name} required></input>
                        <label>Your email address</label>
                        <input type="email" name="email" class="form-control" onChange={this.emailOnChange} value={this.state.email}  required></input>
                        <label>Your message</label>
                        <br />
                        <textarea name="message" onChange={this.messageOnChange} value={this.state.message}></textarea>
                        <button className="btnClass" onClick={this.sendForm}>Send message</button>
                    </div>
                    <NotificationContainer />
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCIYtp0TAtibss1xmUHQ5Le9xltqSJyYWI&libraries=places"></script>
                </div>
            );
        }else{
            return(<div></div>)
        }
    }
}

export default Listing;