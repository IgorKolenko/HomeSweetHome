import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './createListing.scss';
import MultiImageInput from 'react-multiple-image-input';

class CreateListing extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            type: "sale",
            garden: "yes"
        };
        this.changeListingType = this.changeListingType.bind(this);
        this.changeGarden = this.changeGarden.bind(this);
    }

    changeListingType(r){
        this.setState({
            type: r.target.value
        })
    }
    changeGarden(r){
        this.setState( {
            garden: r.target.vaue
        })
    }


    render(){
        return(
            <div id="listingBody">
                <form action="/create-listing" method="POST" encType="multipart/form-data">
                    <h1>Create new listing</h1>
                    <br />
                    <label>Property for sale or rent?</label>
                    <br />
                    <div class="form-check listing-type">
                        <input class="form-check-input" type="radio" name="listingType" id="listingRadios1" value="sale" onClick={this.changeListingType} required/>
                        <p class="form-check-label" for="listingnRadios1">Sale</p>
                    </div>
                    <div class="form-check listing-type">
                        <input class="form-check-input" type="radio" name="listingType" id="listingRadios2" value="rent" onClick={this.changeListingType} />
                        <p class="form-check-label" for="listingRadios2">Rent</p>
                    </div>
                    <br />
                    <label>Select images of property</label>
                    <input type="file" class="form-control-file" id="images" name="images" multiple />
                    <br />
                    <label>Property description</label>
                    <textarea class="form-control" name="description" aria-label="With textarea"></textarea>
                    <br />
                    <label>Property address</label>
                    <input type="text" name="addr" class="form-control" required></input>
                    <br />
                    <label>City</label>
                    <input type="text" name="city" class="form-control" required></input>
                    <br />
                    <label>Area size/m2</label>
                    <input type="number" name="area" class="form-control" defaultValue={40} min="1" required></input>
                    <br />
                    <label>Number of bedrooms</label>
                    <input type="number" name="bedrooms" class="form-control" defaultValue={1} min="1" required></input>
                    <br />
                    <label>Number of bathrooms</label>
                    <input type="number" name="bathrooms" class="form-control" defaultValue={1} min="1" required></input>
                    <br />
                    <label>Number of parking spaces</label>
                    <input type="number" name="parking" class="form-control" defaultValue={1} min="1" required></input>
                    <br />
                    <label>Presence of a garden</label>
                    <br />
                    <div class="form-check garden-form">
                        <input class="form-check-input" type="radio" name="garden" id="gardenRadios1" value="yes" onClick={this.changeGarden} required />
                        <p class="form-check-label" for="gardenRadios1">Yes</p>
                    </div>
                    <div class="form-check garden-form">
                        <input class="form-check-input" type="radio" name="garden" id="gardenRadios2" value="no" onClick={this.changeGarden} />
                        <p class="form-check-label" for="gardenRadios2">No</p>
                    </div>
                    <br />
                    <label>Proximity to the city center/m</label>
                    <input type="number" name="proximity" class="form-control" defaultValue={100} min="1" required></input>
                    <br />
                    <label>Price/$</label>
                    <input type="number" name="price" class="form-control" defaultValue={1000} min="1" required></input>
                    <br />
                    <label>Contact email</label>
                    <input type="email" name="email" class="form-control" required></input>
                    <br />
                    <label>Contact number</label>
                    <input type="tel" name="phone" class="form-control" required></input>
                    <br />
                    <button class="btnClass" type="submit">Submit listing</button>
                </form>
            </div>
        );
    }
}

export default CreateListing;