import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pastListings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

class PastListings extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listings: []
        }
        this.deleteListing = this.deleteListing.bind(this);
    }

    async componentDidMount(){
        await fetch('http://localhost:5000/get-listings', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => {
            this.setState({
                listings: result
            });
        });
    }

    deleteListing(id){
        fetch('http://localhost:5000/delete-listing', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": id
            }),
            mode: 'cors',
            credentials: 'include'
        }).then((res) => {
            window.location.reload(false);
        })
    }

    render(){
        console.log("Past listings: "+JSON.stringify(this.state.listings));
        return(
            <div id="pastBody">
                <h1>Your Listings</h1>
                <br />
                <div class="container mb-4">
                    <div class="row">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col"> </th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Address</th>
                                            <th scope="col" class="text-center">Price</th>
                                            <th scope="col"> </th>
                                            <th scope="col"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.listings.map((item) => {
                                            if(item.listingType == "sale"){
                                                return(
                                                    <tr>
                                                        <td><img src={'http://localhost:5000/images/'+item.imageIDs[0]} style={{width: 80+'px', height: 50+'px'}}/> </td>
                                                        <td>{item.listingType}</td>
                                                        <td>{item.addr+", "+item.city}</td>
                                                        <td>{item.price+" $"}</td>
                                                        <td class="text-right">
                                                            <button class="btn btn-sm btn-danger" onClick={() => this.deleteListing(item._id)}><i><FontAwesomeIcon icon={faTrashAlt} /></i> </button> 
                                                        </td>
                                                        <td class="text-right">
                                                            <button class="btn btn-sm btn-light" onClick={() => window.location.replace("/editlistings/"+item._id)}><i><FontAwesomeIcon icon={faPen} /></i> </button> 
                                                        </td>
                                                    </tr>
                                                );
                                            }else{
                                                return(
                                                    <tr>
                                                        <td><img src={'http://localhost:5000/images/'+item.imageIDs[0]} style={{width: 80+'px', height: 50+'px'}}/> </td>
                                                        <td>{item.listingType}</td>
                                                        <td>{item.addr+", "+item.city}</td>
                                                        <td>{item.price+" $/month"}</td>
                                                        <td class="text-right">
                                                            <button class="btn btn-sm btn-danger" onClick={() => this.deleteListing(item._id)}><i><FontAwesomeIcon icon={faTrashAlt} /></i> </button> 
                                                        </td>
                                                        <td class="text-right">
                                                            <button class="btn btn-sm btn-light" onClick={() => window.location.replace("/editlistings/"+item._id)}><i><FontAwesomeIcon icon={faPen} /></i> </button> 
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default PastListings;