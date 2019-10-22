import React, { Component } from 'react';
import './forgot.css'
import Form from 'react-bootstrap/Form'
import { Link } from "react-router-dom";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
          <div className="outer container-fluid">
            <div className="row tst ml-5 align-items-center">
              <div className='col-lg-4 col-md-4 col-sm-5 col-10 mb-5 mr-5'>
                <div className="form-container" >
                  <Form>
                    <h5 className='mb-3'>FORGOT PASSWORD</h5>
                    <Form.Group controlId="formBasicEmail">
                    <input
                        className="inp"
                        type="text"
                        placeholder="Username or email"
                      />
                    </Form.Group>
    
                    
                    <button
                      className="mt-4 btn-style small"
                      type="submit"
                    >
                      SEND REQUEST
                    </button>
    
                    <div className="row mt-3 ml-1">
                      <Link to="/signup">
                        <span className="txt">New User ? </span>
                        <span className="txt-underline txt ml-1">Register here</span>
                      </Link>
                    </div>
                    <div className="ml-1">
                    <Link to="/login">
                      <p className="txt-underline txt mb-4">Back to login</p>
                    </Link>
                    </div>
                  </Form>
                </div>
              </div>
              <div className="col-lg-6 col-md-7 col-sm-6 col-10 d-flex align-items-center">
              <div className="mb-5 pb-5" style={{overflow:'hidden'}}>
                  <p className="border-left mt-3"></p>
                  <p className="row ml-5 logo-container">
                    <img
                      alt=""
                      src="/ge.png"
                      width="90"
                      height="90"
                      style={{ color: "white" }}
                      className="d-inline-block align-top img-fluid"
                    />
                    <h5 className="ml-3 logo-heading">GE Healthcare</h5>
                  </p>
                  <p className="mt-3 ml-5">
                    <h1 className="headline m-0">X-RAY AI</h1>
                    <h1 className="sub-headline m-0">EXPERIENCE</h1>
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

export default ForgotPassword