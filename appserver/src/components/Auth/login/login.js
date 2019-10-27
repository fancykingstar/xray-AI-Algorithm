import React, { Component } from "react";
import "./login.css";
import Form from "react-bootstrap/Form";
import {Link}  from "react-router-dom";
// import axios from 'axios';
const axios = require("axios");

// import queryString from 'querystring';
const qs = require("querystring");

// let history = useHistory();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  ChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentWillMount() {
    this.checkAuth();
  }
  
  checkAuth = () => {
    const access_token = localStorage.getItem("access_token");
    console.log("access_token", access_token);
    if (access_token) {
      this.props.history.push('/XrayDetails');
    }
  }

  onSubmit = (e) => {
    console.log("call");
    e.preventDefault()
    const postData = {
      client_secret: "d7ad3256-d3b1-4d7b-b496-d353e9da9f63",
      username: this.state.email,
      password: this.state.password,
      client_id: "react-test-client",
      grant_type: "password"
    };
    const axiosConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const url =
      "http://51.79.29.24:9081/auth/realms/XRayAIWeb/protocol/openid-connect/token";
    axios.post(url, qs.stringify(postData), axiosConfig).then(res => {
      console.log("RESPONSE RECEIVED: ", res);
      const tokenData = {
        client_id: "react-test-client",
        grant_type: "refresh_token",
        refresh_token: res && res.data.refresh_token
      }

      axios.post(url, qs.stringify(tokenData), axiosConfig).then(response =>{
        console.log("Respp",response)
        localStorage.setItem("access_token", res && res.data.access_token)
        this.checkAuth();
        // this.props.history.push('/XrayDetails');
      }).catch(error => {
        alert("Something went wrong, Please try again")
        console.log("====", error)
      })

    })
    .catch((err) => {
      alert("Something went wrong, Please try again")
      console.log("AXIOS ERROR: ", err);
    })
  };

  render() {
    return (
      <div className="outer container-fluid">
        <div className="row tst ml-5 align-items-center">
          <div className="col-lg-4 col-md-4 col-sm-5 col-10">
            <div className="form-container">
              <Form >
                <h5 className="m-2 login-title">LOGIN</h5>
                <Form.Group controlId="formBasicEmail">
                  <input
                    className="inp"
                    type="text"
                    placeholder="Username or email"
                    name="email"
                    value={this.state.email}
                    onChange={this.ChangeHandler}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <input
                    className="inp"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.ChangeHandler}
                  />
                </Form.Group>
                <button
                  className="mt-2 btn-style small login-button"
                  type="submit"
                  onClick={(e) => this.onSubmit(e)}
                >
                  ENTER HERE
                </button>

                <div className="row mt-3 ml-1">
                  <Link to="/signup">
                    <span className="txt">New User ? </span>
                    <span className="txt-underline txt ml-1">
                      Register here
                    </span>
                  </Link>
                </div>
                <div className="ml-1">
                  <Link to="/forgot-password">
                    <p className="txt-underline txt mb-4">Forgot password?</p>
                  </Link>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-6 col-10 d-flex align-items-center">
            <div className="mb-5 pb-5" style={{ overflow: "hidden" }}>
              <p className="border-left mt-3"></p>
              <p className="row ml-5 logo-container">
                <img
                  alt=""
                  src={require('../../../assets/logo-ge.svg')}
                  width="100"
                  height="100"
                  style={{ color: "white" }}
                  className="d-inline-block align-top img-fluid"
                />
                <span className="ml-3 logo-heading">GE Healthcare</span>
              </p>
              <p className="mt-3 ml-5 login-adver">
                <p className="headline m-0">X-RAY AI</p>
                <span className="sub-headline m-0">EXPERIENCE</span>
              </p>
            </div>
          </div>

          {/* second section end */}
        </div>
        {/* right logo */}
        <div>
          <img
            alt=""
            src={require("../../../assets/edison-logo.png")}
            width="140"
            height="60"
            style={{
              color: "white",
              position: "fixed",
              bottom: 60,
              right: 45
            }}
          />
        </div>
      </div>
    );
  }
}

export default Login;
