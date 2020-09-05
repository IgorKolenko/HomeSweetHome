import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './buy.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

class Buy extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            dropdownValue: "yes",
            city: "",
            minBedrooms: 1,
            minBathrooms: 1,
            minParking: 1,
            minArea: 40,
            maxPrice: 100000,
            returnedJson: []
        }
        this.toggleOpen = this.toggleOpen.bind(this);
        this.dropdownOnClick = this.dropdownOnClick.bind(this);
        this.cityChange = this.cityChange.bind(this);
        this.minBedroomsChange = this.minBedroomsChange.bind(this);
        this.minBathroomChange = this.minBathroomChange.bind(this);
        this.minParkingChange = this.minParkingChange.bind(this);
        this.minAreaChange = this.minAreaChange.bind(this);
        this.maxPriceChange = this.maxPriceChange.bind(this);
        this.formSend = this.formSend.bind(this);
        this.redToItemPage = this.redToItemPage.bind(this);
    }

    componentDidMount(){    
        const { match: { params } } = this.props;
        console.log("Params city: "+params.city);
        if(params.city == undefined){
            console.log("params city undefined")
            fetch('http://localhost:5000/filter-listings', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "listingType": "sale",
                    "city": this.state.city,
                    "minBedrooms": this.state.minBedrooms,
                    "minBathrooms": this.state.minBathrooms,
                    "minParking": this.state.minParking,
                    "garden": this.state.dropdownValue,
                    "minArea": this.state.minArea,
                    "maxPrice": this.state.maxPrice
                }),
                mode: 'cors',
                credentials: 'include'
            })
            .then((resp) => {
                return resp.json();
            })
            .then((json) => {
                this.setState({
                    returnedJson: json
                })
            });
        }else{
            this.setState({
                city: params.city
            });
            fetch('http://localhost:5000/filter-listings', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "listingType": "sale",
                    "city": params.city,
                    "minBedrooms": this.state.minBedrooms,
                    "minBathrooms": this.state.minBathrooms,
                    "minParking": this.state.minParking,
                    "garden": this.state.dropdownValue,
                    "minArea": this.state.minArea,
                    "maxPrice": this.state.maxPrice
                }),
                mode: 'cors',
                credentials: 'include'
            })
            .then((resp) => {
                return resp.json();
            })
            .then((json) => {
                this.setState({
                    returnedJson: json
                })
            });
        }
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    dropdownOnClick(b){
        b.preventDefault();
        const value = b.target.value;
        this.setState({
            dropdownValue: value
        });
    }

    cityChange(i){
        this.setState({
            city: i.target.value
        })
    }

    minBedroomsChange(i){
        this.setState({
            minBedrooms: parseInt(i.target.value)
        })
    }

    minBathroomChange(i){
        this.setState({
            minBathrooms: parseInt(i.target.value)
        })
    }

    minParkingChange(i){
        this.setState({
            minParking: parseInt(i.target.value)
        })
    }

    minAreaChange(i){
        this.setState({
            minArea: parseInt(i.target.value)
        })
    }

    maxPriceChange(i){
        this.setState({
            maxPrice: parseInt(i.target.value)
        })
    }

    formSend(b){
        b.preventDefault();
        fetch('http://localhost:5000/filter-listings', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "listingType": "sale",
                "city": this.state.city,
                "minBedrooms": this.state.minBedrooms,
                "minBathrooms": this.state.minBathrooms,
                "minParking": this.state.minParking,
                "garden": this.state.dropdownValue,
                "minArea": this.state.minArea,
                "maxPrice": this.state.maxPrice
            }),
            mode: 'cors',
            credentials: 'include'
        })
        .then((resp) => {
            return resp.json();
        })
        .then((json) => {
            this.setState({
                returnedJson: json
            })
        });
    }

    redToItemPage(id){
        window.location.replace("/listings/"+id);
    }

    render(){
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        var json = this.state.returnedJson;
        var self = this;
        return(
            <div id="buyBody">
                <div id="buyFilter">
                    <div class="filterElement">
                        <label>City</label>
                        <input type="text" name="city" class="form-control" onChange={this.cityChange} defaultValue={this.state.city}></input>
                    </div>
                    <div class="filterElement">
                        <label>Min bedrooms</label>
                        <input type="number" name="bedrooms" class="form-control" defaultValue={1} min="1" onChange={this.minBedroomsChange}></input>
                    </div>
                    <div class="filterElement">
                        <label>Min bathrooms</label>
                        <input type="number" name="badthrooms" class="form-control" defaultValue={1} min="1" onChange={this.minBathroomChange}></input>
                    </div>
                    <div class="filterElement">
                        <label>Min parking spaces</label>
                        <input type="number" name="parking" class="form-control" defaultValue={1} min="1" onChange={this.minParkingChange}></input>
                    </div>
                    <div class="filterElement">
                        <label>Presence of a garden</label>
                        <div className="btn-group" id="gardenDropdown" onClick={this.toggleOpen}>
                            <button type="button" className="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.dropdownValue}
                            </button>
                            <div className={menuClass}>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="yes">Yes</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="no">No</button>
                            </div>
                        </div>
                    </div>
                    <div class="filterElement">
                        <label>Min area size</label>
                        <input type="number" name="area" class="form-control" defaultValue={40} min="1" onChange={this.minAreaChange}></input>
                    </div>
                    <div class="filterElement">
                        <label>Max price</label>
                        <input type="number" name="price" class="form-control" defaultValue={100000} min="1" onChange={this.maxPriceChange}></input>
                    </div>
                    <button class="btnClass" onClick={this.formSend}>Filter</button> 
                </div>

                <div class="listingDisplay">
                    {json.map(function(listing){
                        return(
                            <div className="card" style={{width: 18+'rem'}} value={listing._id} onClick={() => self.redToItemPage(listing._id)}>
                                <div className="imgDiv"><img src={'http://localhost:5000/images/'+listing.imageIDs[0]} className="card-img-top" alt="..." /></div>
                                <div className="card-body">
                                    <h3 className="card-title">{"$"+listing.price}</h3>
                                    <p className="card-text"><FontAwesomeIcon icon={faBed} />-{listing.bedrooms} &nbsp;&nbsp; <FontAwesomeIcon icon={faBath} />-{listing.bathrooms}</p>
                                    <p className="card-text" style={{color: "gray"}}><FontAwesomeIcon icon={faMapMarkedAlt} /> {listing.addr}, {listing.city}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Buy;