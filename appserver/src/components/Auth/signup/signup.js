import React, {Component} from "react";
import "./signup.css";
import Form from "react-bootstrap/Form";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRole: null,
      showInputOtherRole: false,
      leftPanelOpacity: false,
      showSignupButton: false,
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        leftPanelOpacity: true
      })
    }, 2800);
  }

  showSignupButton() {
    this.setState({showSignupButton: true});
  }

  // selectRoleOption = (event) => {
  //   if(event.target.value === 'other'){
  //     this.setState({
  //       showInputOtherRole:true
  //     })
  //   }else{
  //     this.setState({
  //       showInputOtherRole:false
  //     })
  //   }
  // }

  getSelectedRole() {
    return this.state.selectedRole;
  }

  isOtherInput() {
    return this.state.showInputOtherRole;
  }

  selectRoleOption = (value) => {
    this.state.selectedRole = value;
    if (value === 'Other') {
      this.state.showInputOtherRole = true;
    } else {
      this.state.showInputOtherRole = false;
    }
    this.setState(this.state);
  };


  render() {
    return (
      <div className="main-container bg">
        <div className={"pt-5 pr-5 contents " + (this.state.leftPanelOpacity ? 'left-panel-opacity' : '')}>
          <div style={{width: '70vw'}} className="row justify-content-center align-items-start mt-5 pt-5">
            <div className="col-xl-5 col-lg-6 pl-5 pr-5">

              <div>
                <Form>
                  <h4>SIGN UP</h4>
                  <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="text"
                      placeholder="First Name"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="text"
                      placeholder="Last Name"
                    />
                  </Form.Group>

                  {/* <Form.Group controlId="formBasicEmail" className='mb-0'>
                    <select onClick={this.selectRoleOption} className="inp custom-select">
                      <option value="">Title/Role</option>
                      <option value="">Radiologist</option>
                      <option value="">Radiologic Technologist</option>
                      <option value="">Radiology Management</option>
                      <option value="other">Other</option>
                    </select>
                  </Form.Group> */}

<div className='form-group'>
                    <button className="text-left custom-btn" type="button" data-toggle="collapse"
                            data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                      {this.getSelectedRole() || 'Title/Role'}
                    </button>
                    <div className="collapse default-color mt-2 pl-2" id="collapseExample">
                      <div
                        className={`cursor p-1 pl-4 ${this.getSelectedRole() === 'Radiologist' ? 'active' : ''}`}
                        onClick={() => this.selectRoleOption('Radiologist')}>
                        Radiologist
                      </div>
                      <div
                        className={`cursor p-1 pl-4 ${this.getSelectedRole() === 'Radiologic Technologist' ? 'active' : ''}`}
                        onClick={() => this.selectRoleOption('Radiologic Technologist')}>
                        Radiologic Technologist
                      </div>
                      <div
                        className={`cursor p-1 pl-4 ${this.getSelectedRole() === 'Radiologic Management' ? 'active' : ''}`}
                        onClick={() => this.selectRoleOption('Radiologic Management')}>
                        Radiologic Management
                      </div>
                      <div
                        className={`cursor p-1 pl-4 ${this.getSelectedRole() === 'Other' ? 'active' : ''}`}
                        onClick={() => this.selectRoleOption('Other')}>
                        Other
                      </div>
                    </div>
                  </div>

                  {this.isOtherInput()  ? <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="text"
                      placeholder="Other"
                    />
                  </Form.Group> : null}
                  <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="text"
                      placeholder="Institution Name"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="email"
                      placeholder="Email"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <input
                      className="inp"
                      type="text"
                      placeholder="Username"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <input
                      className="inp"
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <input
                      className="inp"
                      type="password"
                      placeholder="Re-enter Password"
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 signup-discription small mt-4">

              <div style={{maxHeight: '400px', overflowY: 'scroll', paddingRight: '10px'}}>
                <h5>Terms and conditions </h5>
                <p>
                  Legal text goes here. Lorem ipsum dolor sit amet, dicat
                  facilisis evertitur an quo, ius populo aperiam lucilius eu,
                  sapientem maiestatis interpretaris nam in. Sint audire alterum
                  quo id. Eam doctus invidunt definitionem cu, an ipsum consul
                  tibique qui. Sint audire alterum quo id. Eam doctus invidunt
                  definitionem cu, an ipsum consul tibique Legal text goes here.
                  Lorem ipsum dolor sit amet, dicat facilisis evertitur an quo,
                  ius populo aperiam lucilius eu, sapientem maiestatis
                </p>
                <p>
                  interpretaris nam in. Sint audire alterum quo id. Eam doctus
                  invidunt definitionem cu, an ipsum consul tibique qui. Sint
                  audire alterum quo id. Eam doctus invidunt definitionem cu, an
                  ipsum consul tibique Legal text goes here. Lorem ipsum dolor sit
                  amet, dicat facilisis evertitur an quo, ius populo aperiam
                  lucilius eu, sapientem maiestatis interpretaris nam in. Sint
                </p>
                <p>
                  Legal text goes here. Lorem ipsum dolor sit amet, dicat facilisis evertitur an quo, ius populo aperiam
                  lucilius eu, sapientem maiestatis interpretaris nam in. Sint audire alterum quo id. Eam doctus
                  invidunt definitionem cu, an ipsum consul tibique qui. Sint audire alterum quo id. Eam doctus invidunt
                  definitionem cu, an ipsum consul tibique
                </p>
                <p>
                  interpretaris nam in. Sint audire alterum quo id. Eam doctus
                  invidunt definitionem cu, an ipsum consul tibique qui. Sint
                  audire alterum quo id. Eam doctus invidunt definitionem cu, an
                  ipsum consul tibique Legal text goes here. Lorem ipsum dolor sit
                  amet, dicat facilisis evertitur an quo, ius populo aperiam
                  lucilius eu, sapientem maiestatis interpretaris nam in. Sint
                </p>
              </div>
              <div className="d-block mt-4">
                <label>
                  <input type="radio" name="optradio" onChange={() => this.showSignupButton()}/>
                  {/* <input type="radio" id="test1" name="radio-group" className="xray-detail-radio-btn" onChange={(e) => this.showSignupButton(e)} /> */}
                  <span className='ml-2'>I Accept Terms & Conditions</span>
                </label>
              </div>
              {
                this.state.showSignupButton ?
                  <button
                    className="mt-2 btn-style"
                    type="submit"
                  >
                    SIGN UP
                  </button>

                  : null}

            </div>
          </div>
        </div>

        <div data-animation='first'>
          <div style={{width: '30vw'}} className="d-flex align-items-center">
            <p className="mb-5 pb-5" style={{overflow: 'hidden'}}>
              <p className="border-left mt-3"></p>
              <p className="row ml-3 logo-container">
                <img
                  alt=""
                  src="/ge.png"
                  width="60"
                  height="80"
                  style={{color: "white"}}
                  className="d-inline-block align-top img-fluid"
                />
                <h5 className="ml-3 logo-heading">GE Healthcare</h5>
              </p>

              <p className="mt-3 ml-4">
                <h1 className="headline">X-RAY AI</h1>
                <h3 className="sub-headline">EXPERIENCE</h3>
              </p>
            </p>
          </div>

        </div>
        <div style={{
          color: "white",
          bottom: 65,
          right: 70,
          position: "absolute"
        }}>
          <img
            alt=""
            src={require("../../../assets/edison-logo.png")}
            width="120"
            height="60"
            className="img-fluid"
          />
        </div>
      </div>
    );
  }
}

export default Signup;