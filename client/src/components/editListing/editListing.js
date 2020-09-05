import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './editListing.scss'

class EditListing extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        };
    }

    componentDidMount(){
        console.log("Entering componentDidMount");
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
        }).then((resp) => resp.json()).then(json => {
            if(json.listingType == "sale"){
                document.getElementById("editListingRadios1").checked = true;
            }else{
                document.getElementById("editListingRadios2").checked = true;
            }

            if(json.garden == "yes"){
                document.getElementById("editGardenRadios1").checked = true;
            }else{
                document.getElementById("editGardenRadios2").checked = true;
            }

            this.setState({
                json: json
            });
        })
    }

    render(){
        var json = this.state.json;
        if(json != {}){
            return(
                <div id="editListingBody">
                    <form action="/edit-listing" method="POST" encType="multipart/form-data">
                        <h1>Edit listing</h1>
                        <br />
                        <label>Property for sale or rent?</label>
                        <br />
                        <div class="form-check listing-type">
                            <input class="form-check-input" type="radio" name="listingType" id="editListingRadios1" value="sale" required/>
                            <p class="form-check-label" for="listingnRadios1">Sale</p>
                        </div>
                        <div class="form-check listing-type">
                            <input class="form-check-input" type="radio" name="listingType" id="editListingRadios2" value="rent" />
                            <p class="form-check-label" for="listingRadios2">Rent</p>
                        </div>
                        <br />
                        <label>Select images of property</label>
                        <input type="file" class="form-control-file" id="images" name="images" multiple />
                        <br />
                        <label>Property description</label>
                        <textarea class="form-control" name="description" aria-label="With textarea" defaultValue={json.description}></textarea>
                        <br />
                        <label>Property address</label>
                        <input type="text" name="addr" class="form-control" defaultValue={json.addr} required></input>
                        <br />
                        <label>City</label>
                        <input type="text" name="city" class="form-control" defaultValue={json.city} required></input>
                        <br />
                        <label>Area size/m2</label>
                        <input type="number" name="area" class="form-control" defaultValue={json.area} min="1" required></input>
                        <br />
                        <label>Number of bedrooms</label>
                        <input type="number" name="bedrooms" class="form-control" defaultValue={json.bedrooms} min="1" required></input>
                        <br />
                        <label>Number of bathrooms</label>
                        <input type="number" name="bathrooms" class="form-control" defaultValue={json.bathrooms} min="1" required></input>
                        <br />
                        <label>Number of parking spaces</label>
                        <input type="number" name="parking" class="form-control" defaultValue={json.parking} min="1" required></input>
                        <br />
                        <label>Presence of a garden</label>
                        <br />
                        <div class="form-check garden-form">
                            <input class="form-check-input" type="radio" name="garden" id="editGardenRadios1" value="yes" required />
                            <p class="form-check-label" for="gardenRadios1">Yes</p>
                        </div>
                        <div class="form-check garden-form">
                            <input class="form-check-input" type="radio" name="garden" id="editGardenRadios2" value="no" />
                            <p class="form-check-label" for="gardenRadios2">No</p>
                        </div>
                        <br />
                        <label>Proximity to the city center/m</label>
                        <input type="number" name="proximity" class="form-control" defaultValue={json.proximity} min="1" required></input>
                        <br />
                        <label>Price/$</label>
                        <input type="number" name="price" class="form-control" defaultValue={json.price} min="1" required></input>
                        <br />
                        <label>Contact email</label>
                        <input type="email" name="email" class="form-control" defaultValue={json.email} required></input>
                        <br />
                        <label>Contact number</label>
                        <input type="tel" name="phone" class="form-control" defaultValue={json.phone} required></input>
                        <br />
                        <button class="btnClass" type="submit">Update listing</button>
                    </form>
                </div>
            );
        }else{
            return(<div></div>)
        }
    }
}

export default EditListing;