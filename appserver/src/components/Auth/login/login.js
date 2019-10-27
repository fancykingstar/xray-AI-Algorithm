import React, { Component } from "react";
import "./login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row tst ml-3">
          {/* form */}
          <div className='col-lg-4 col-md-4 col-sm-6 col-10 mb-5'>
            <div className="form-container" >
              <Form>
                <h5 className='m-2'>LOGIN</h5>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    className="inp"
                    type="email"
                    placeholder="Username or email"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    className="inp"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button
                  className="mt-2 btn btn-txt small"
                  // variant="primary"
                  type="submit"
                >
                  ENTER HERE
                </Button>

                <div className="row mt-3 ml-1">
                  <Link to="/signup">
                    <span className="txt">New User ? </span>
                    <span className="txt-underline txt ml-1">Register Here</span>
                  </Link>
                </div>
                <Link to="/forgot-password">
                  <p className="txt-underline txt mb-4">Forgot Password</p>
                </Link>
              </Form>
            </div>
          </div>
          {/* one section end */}
          <div className='border-right'>

          </div>
          {/* middle section */}
          <div className="col-lg-4 col-md-4 col-sm-6 col-10 right-section">
            <div className="row ml-3  logo-container">
              <img
                alt=""
                src="/ge.png"
                width="80"
                height="80"
                style={{ color: "white" }}
                className="d-inline-block align-top"
              />
              <h5 className="ml-3 logo-heading">GE Healthcare</h5>
            </div>

            <div className="mt-3 ml-3">
              <h1>X-R A Y A I</h1>
              <h3>E X P E R I E N C E </h3>
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
