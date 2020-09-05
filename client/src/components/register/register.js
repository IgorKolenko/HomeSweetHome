import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.scss';

class Register extends React.Component{
    constructor(){
        super();
        this.state = {
            msg: ""
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/register-msg', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => this.setState({
            msg: result.msg
        }));
        console.log("Message: "+this.state.msg);
    }

    render(){
        return(
            <div id="registerBody">
                <div class="wrapper">
                    <form class="form-signin" action="/register-user" method="POST">       
                        <h2 class="form-signin-heading">Register as Seller</h2>
                        <p>{this.state.msg}</p>
                        <input type="text" class="form-control" name="name" placeholder="Name" required autofocus="" />
                        <br />
                        <input type="text" class="form-control" name="surname" placeholder="Surname" required autofocus="" />
                        <br />
                        <input type="email" class="form-control" name="email" placeholder="Email Address" required autofocus="" />
                        <br />
                        <input type="password" class="form-control" name="password" placeholder="Password" required/>
                        <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm password" required/>      
                        <button class="btnClass" type="submit">Register</button>   
                    </form>
                </div>
            </div>
        )
    }
}

export default Register;