import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.scss';

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            msg: ""
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/login-msg', {
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
            <div id="loginBody">
                <div class="wrapper">
                    <form class="form-signin" action="/login-user" method="POST">       
                        <h2 class="form-signin-heading">Login as Seller</h2>
                        <p>{this.state.msg}</p>
                        <input type="email" class="form-control" name="email" placeholder="Email Address" required autofocus="" />
                        <br />
                        <input type="password" class="form-control" name="password" placeholder="Password" required/>      
                        <button class="btnClass" type="submit">Login</button>
                        <br />
                        <a href="/register">Create an account</a>   
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;