import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

class Navbar extends React.Component{
    constructor(props) {
        super(props);
            this.state = {
            menu: false,
            username: ""
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.LogoutUser = this.LogoutUser.bind(this);
    }

    componentDidMount(){
        console.log("Fetching user");
        fetch('http://localhost:5000/logged-user', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => {
            if(result.email != null){
                this.setState({
                    username: result.email
                })
            }else{
                this.setState({
                    username: ""
                })
            }
        });
    }
    
      LogoutUser(b){
        b.preventDefault()
        fetch('http://localhost:5000/logout-user', {
                method: 'GET', 
                mode: 'cors',
                credentials: 'include'
        }).then((result) => {
            window.location.replace("/");
        });
      }

    toggleMenu(){
        this.setState({ menu: !this.state.menu })
    }

    render(){
        const show = (this.state.menu) ? "show" : "" ;
        return(
            <nav className="navbar navbar-expand-md sticky-top">

                <span className="navbar-text">Home Sweet Home <FontAwesomeIcon icon={faHome} /></span>
                
                <button className="navbar-toggler" type="button" onClick={this.toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                
                <div className={"collapse navbar-collapse " + show}>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/buy">Buy</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/rent">Rent</a>
                        </li>
                        <li className="nav-item">
                            {this.state.username != "" ? <a className="nav-link" onClick={this.LogoutUser} href="#">Logout</a> : <a className="nav-link" href="/login">Login as Seller</a>}
                        </li>
                        {this.state.username != "" ? <li className="nav-item"><a className="nav-link" href="/createlisting">Create Listing</a></li> : <li className="nav-item"><a className="nav-link" href="/register">Register as Seller</a></li>}
                        {this.state.username != "" ? <li className="nav-item"><a className="nav-link" href="/pastlistings">Past listings</a></li> : false}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;