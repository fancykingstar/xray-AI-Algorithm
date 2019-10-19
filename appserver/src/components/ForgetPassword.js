import React from "react";
import "./css/main.css";
import "./css/util.css";
import lineImage from "./images/line.png";
import loginLogo from "./images/loginlogo.png";
import edisonLogo from "./images/edison-logo.png";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Password: ""
    };
  }

  render() {
    return (
      <div className="limiter">
        <div className="container-login100 bg">
          <div className="wrap-login100 p-t-134 p-b-30">
            <div className="col-12 displayflex">
              <div className="col-4">
                <h5 className="h5">LOGIN</h5>
                <form className="login100-form validate-form loginform">
                  <div
                    className="wrap-input100 validate-input m-b-10"
                    data-validate="Username is required"
                  >
                    <input
                      className="input100"
                      type="text"
                      name="username"
                      placeholder="Email"
                    />
                  </div>

                  <div className="container-login100-form-btn p-t-10">
                    <button className="login100-form-btn">ENTER HERE</button>
                  </div>

                  <div className="w-full p-t-8 p-b-230 textleft">
                    <a href="/signup" className="txt1">
                      New user? Register here.
                    </a>
                    <br />
                    <a href="/forgetpassword" className="txt1">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
              <div className="col-1">
                <img src={lineImage} />
              </div>
              <div className="col-7 textleft">
                <img src={loginLogo} />
                <h7 className="h7">GE Healthcare</h7>
                <h1 className="h1">X-RAY AI</h1>
                <h3 className="h3">EXPERIENCE</h3>
              </div>
            </div>
          </div>
          <div className="rightlogo">
            <img src={edisonLogo} />
          </div>
        </div>
        <footer className="footer">© 2019 General Electric Company.</footer>
      </div>
    );
  }
}

export default ForgotPassword;
