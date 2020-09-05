import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homepage.css';
import img1 from './pic1.jpg';
import Fade from 'react-reveal/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            city: ""
        }
        this.cityOnChange = this.cityOnChange.bind(this);
        this.buyRed = this.buyRed.bind(this);
        this.rentRed = this.rentRed.bind(this);
    }

    cityOnChange(t){
        this.setState({
            city: t.target.value
        });
    }

    buyRed(b){
        b.preventDefault();
        window.location.replace("/buy/"+this.state.city);
    }

    rentRed(b){
        b.preventDefault();
        window.location.replace("/rent/"+this.state.city);
    }

    render(){
        return(
            <div id="homepageBody">
                <link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;600;800&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" rel="stylesheet"></link>
                <div id="parallaxImg">
                    <Fade top>
                    <h1>Find the house of your <span className="prominent">DREAMS</span></h1>
                    </Fade>
                    <div class="input-group" id="homepageForm">
                        <input type="text" class="form-control" placeholder="Enter city" aria-label="Enter city" aria-describedby="basic-addon2" onChange={this.cityOnChange} />
                        <div class="input-group-append">
                            <button className="btnClass" type="button" onClick={this.buyRed}>Buy</button>
                            <button className="btnClass" type="button" onClick={this.rentRed}>Rent</button>
                        </div>
                    </div>
                </div>
                <div className="article">
                    <Fade left>
                    <div className="articleText">
                        <h1>Homes you will <span className="prominent">LOVE</span></h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec ligula vestibulum, rutrum justo sit amet, pharetra mauris. Nulla neque purus, scelerisque eu dolor ut, rhoncus aliquet nunc. Nunc erat arcu, consectetur eu porttitor nec, pretium vel nibh. In in volutpat nibh. Mauris egestas, neque vel tincidunt vulputate, lorem nunc iaculis quam, vitae aliquam nisl mi non diam. Ut orci enim, dignissim vitae odio ut, porta gravida elit. Ut semper, purus nec elementum egestas, libero justo faucibus mi, fringilla hendrerit est diam sit amet lorem. Sed dictum eget turpis ac euismod. Morbi id ultricies purus, non ornare tortor. Proin consectetur fringilla sem, sit amet hendrerit nulla mollis et. Fusce sollicitudin eu dui fermentum sagittis.</p>
                    </div>
                    </Fade>
                    <Fade right>
                    <img src={img1} className="img-fluid" height="305" width="500" ></img>
                    </Fade>
                </div>
                <div id="secondParallax">
                    <Fade top>
                    <h1>Selling houses all over the <span className="prominent">WORLD</span></h1>
                    </Fade>
                </div>
                <div id="services">
                    <Fade top>
                    <h1>Our <span className="prominent">SERVICES</span></h1>
                    </Fade>
                    <div class="cardHolder">
                        <Fade top>
                        <div className="service">
                            <FontAwesomeIcon className="serviceIcon" icon={faMapMarkedAlt} />
                            <h2>Find homes anywhere in the world</h2>
                            <p>Sed ullamcorper interdum turpis suscipit rhoncus. Mauris non tellus sit amet diam tempor faucibus. Vivamus maximus finibus magna ut convallis. Nullam tristique ligula at faucibus faucibus.</p>
                        </div>
                        </Fade>
                        <Fade top>
                        <div className="service">
                            <FontAwesomeIcon className="serviceIcon" icon={faPhone} />
                            <h2>Contact sellers directly</h2>
                            <p>Donec ornare ex vel elit ornare, eu commodo ligula ornare. Mauris hendrerit lacus et quam eleifend pulvinar sed sed massa. Vestibulum eleifend massa et dolor auctor, vel feugiat ligula sagittis. Ut sit amet venenatis libero, sed placerat nulla. Maecenas nec vulputate elit.</p>
                        </div>
                        </Fade>
                        <Fade top>
                        <div className="service">
                            <FontAwesomeIcon className="serviceIcon" icon={faHome} />
                            <h2>Buy or rent beautiful properties</h2>
                            <p>Vestibulum faucibus metus eget diam vulputate laoreet. Vivamus id lorem elementum, euismod ante eget, viverra est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur ac accumsan ex, in commodo justo.</p>
                        </div>
                        </Fade>
                    </div>
                </div>
            </div>
        )
    }
}

export default Homepage;