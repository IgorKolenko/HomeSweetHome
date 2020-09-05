import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar/navbar';
import Homepage from './components/homepage/homepage';
import Login from './components/login/login';
import Register from './components/register/register';
import CreateListing from './components/createListing/createListing';
import PastListings from './components/pastListings/pastListings';
import EditListing from './components/editListing/editListing';
import Buy from './components/buy/buy';
import Rent from './components/rent/rent';
import Listing from './components/listing/listing';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
      isLogged: false,
      responded: false
    };
  }

  async componentDidMount(){
    console.log("Fetching user");
    await fetch('http://localhost:5000/logged-user', {
        method: 'GET', 
        mode: 'cors',
        credentials: 'include'
    }).then(res => res.json()).then((result) => {
        if(result.email != null){
            this.setState({
                username: result.email,
                isLogged: true,
                responded: true
            })
        }else{
            this.setState({
                username: "",
                isLogged: false,
                responded: true
            })
        }
    });
  }

  render(){
    console.log("Is logged: "+ this.state.isLogged);
    if(this.state.responded){
      return (
        <Router>
          <link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;600;800&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" rel="stylesheet"></link>
          <div className="App">
            <Navbar />
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route exact path="/login">
                {this.state.isLogged == false ? <Login /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/register">
                {this.state.isLogged == false ? <Register /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/createlisting">
                {this.state.isLogged == true ? <CreateListing /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/pastlistings">
                {this.state.isLogged == true ? <PastListings /> : <Redirect to="/" />}
              </Route>
              <Route path="/editlistings/:listingId" exact component={EditListing} />
              <Route path="/buy/:city" exact component={Buy} />
              <Route path="/buy" params={{city: ""}} exact component={Buy} />
              <Route path="/rent/:city" exact component={Rent} />
              <Route path="/rent" params={{city: ""}} exact component={Rent} />
              <Route path="/listings/:listingId" exact component={Listing} />
          
            </Switch>
          </div>
        </Router>
      );
    }else{
      return <div></div>
    }
  }
}

export default App;
