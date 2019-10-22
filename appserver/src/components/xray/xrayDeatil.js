import React, { Component } from "react";
import "./xray.css";
class XrayDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openRightPanel: true,
      selectedFile: null,
      imagePreviewUrl: null,
      autoRotate: false,
      colHeck: false,
      viewCheck: false,
      pneumothorox: false,
      showButton: false
    };
  }

  componentWillMount() {}
  fileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      image: true
    });

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  rightPanelState = () => {
    this.setState({ openRightPanel: !this.state.openRightPanel });
  };
  autoRotate = () => {
    this.setState({
      autoRotate: !this.state.autoRotate,
      viewCheck: false,
      colHeck: false,
      showButton: !this.state.showButton
    });
  };
  colHeck = () => {
    this.setState({
      colHeck:!this.state.colHeck,
      autoRotate: false,
      viewCheck: false,
      showButton: !this.state.showButton
    });
  };

  viewCheck = () => {
    this.setState({
      viewCheck: !this.state.viewCheck,
      autoRotate: false,
      colHeck: false,
      showButton: !this.state.showButton
    });
  };
  onPneumothoroxChecked = e => {
    this.setState({
      pneumothorox: !this.state.pneumothorox,
      autoRotate: !this.state.pneumothorox,
      viewCheck: !this.state.pneumothorox,
      colHeck: !this.state.pneumothorox,
      showButton: !this.state.showButton
    });
  };
  resetRadio = () =>{
    this.setState({
        pneumothorox: false,
        autoRotate: false,
        viewCheck: false,
        colHeck: false,
        showButton: false
      });
  }

  render() {
    return (
      <div className="bg">
        <div
          onContextMenu={e => e.preventDefault()}
          className="d-flex justify-content-center align-items-center"
        >
          {this.state.imagePreviewUrl ? (
            <img
              alt="xray"
              className="img-fluid h-100"
              src={this.state.imagePreviewUrl}
            />
          ) : (
            <img
              alt="xray"
              className="img-fluid h-100"
              src={require("../../assets/xray-chest-demo-image.jpeg")}
            />
          )}
        </div>
        <div
          className={
            "right-panel m-2 " +
            (this.state.openRightPanel ? "opened" : "closed")
          }
        >
          <div className="row">
            {/* side image */}
            <div style={{ margin: "inherit", marginTop: 130, marginLeft: -20, display:"flex", alignItems:"center" }}>
              <img
                alt="menu arrow icon"
                src={require("../../assets/menu-arrow.png")}
                onClick={this.rightPanelState}
                className={
                  "img-fluid " +
                  (this.state.openRightPanel ? "" : "open-menu-arrow")
                }
              />
             {  !this.state.openRightPanel && <h1 style={{ transform: "rotate(90deg)", marginLeft: -85, fontSize: 30, letterSpacing: 5 }}> Al Algorithm</h1>}
            </div>
            {/* ends */}
          <div className="col-lg-5">
              <div className="row">
                <img
                  alt="arrow icon"
                  src={require("../../assets/arrow-icon.svg")}
                  width="100"
                  height="40"
                />

                <h5 className="mt-2"> Al Algorithm </h5>
              </div>

              <div className="m-5 text-center"  >
                <div
                  className="d-flex m-0 justify-content-center align-items-center"
                  style={{
                    height: 120,
                    backgroundColor: "black",
                    alignSelf: "center"
                  }}
                >
                  {this.state.imagePreviewUrl ? (
                    <img
                      alt="xray"
                      src={this.state.imagePreviewUrl}
                      className="img-fluid h-100"
                    />
                  ) : (
                    <img
                      alt="xray"
                      src={require("../../assets/xray-chest-demo-image.jpeg")}
                      className="img-fluid h-100"
                    />
                  )}
                </div>
                <div
                  className="mt-3"
                  style={{
                    height: 40,
                    marginTop: 20,
                    border: "2px dotted #00B5E2"
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="file"
                      onChange={this.fileChangedHandler}
                      name="file"
                      id="file"
                      className="inputfile"
                    />
                    <label for="file text-bold">Input New Image</label>
                    {/* <input type="file"  className='mr-1' style={{ color: '#00B5E2', }}></input> */}
                    <img
                      alt="plus icon"
                      src={require("../../assets/add-icon.svg")}
                      width="20px"
                      height="20px"
                    />
                  </div>
                </div>
                <div
                  className="mt-3"
                  style={{
                    height: 30,
                    alignSelf: "center",
                    border: "2px solid #00B5E2",
                    color:"#00B5E2",
                    textAlign:"center"
                  }}
                >
                    demo Images
                </div>

                <hr style={{ color:"#00B5E2"}} />
               {this.state.showButton &&  <button
                  className="mt-2 orange-btn-style small"
                  type="submit"
                >
                  Start <br /> Inferencing
                </button>}
              </div>
            </div>
            {/* first section end */}
             <div className={"col-lg-5" + (this.state.openRightPanel ? "" : "quality-alignment")}>
              <h5 className="mt-3">QUALITY CARE SUITE</h5>
              <div>
                <p className="btm-border">
                  <input
                    checked={
                      this.state.pneumothorox === true ||
                       this.state.autoRotate === true 
                    }
                    type="radio"
                    id="test1"
                    // name="autoRotate"
                    className="xray-detail-radio-btn"
                    onClick={this.autoRotate}
                  />
                  <label for="test1">CHEST: AUTO ROTATE</label>
                </p>
                <p className="btm-border">
                  <input
                    checked={
                      this.state.pneumothorox === true ||
                      this.state.colHeck === true 
                    }
                    type="radio"
                    id="test2"
                    // name="colHeck"
                    className="xray-detail-radio-btn"
                    onClick={this.colHeck}
                  />
                  <label for="test2">CHEST: PROTOCOL CHECK</label>
                </p>
                <p className="btm-border">
                  <input
                    checked={
                      this.state.pneumothorox === true ||
                     this.state.viewCheck === true 
                    }
                    type="radio"
                    id="test3"
                    // name="viewCheck"
                    className="xray-detail-radio-btn"
                    onClick={this.viewCheck}
                  />
                  <label for="test3">CHEST: FIELD OF VIEW CHECK</label>
                </p>
              </div>

              <div className="mt-5 mb-4 ml-3">
                <h5 className="mt-3">CRITICAL CARE SUITE</h5>
              </div>

              <p className="btm-border">
                <input
                  checked = {this.state.pneumothorox}
                  type="radio"
                  id="test4"
                //   name="pneumothorox"
                  className="xray-detail-radio-btn"
                  onClick={this.onPneumothoroxChecked}
                />
                <label for="test4">PNEUMOTHOROX</label>
              </p>
              <button type="button" className="btn btn-secondary" onClick={this.resetRadio}>
                RESET{" "}
              </button>
            </div> 
          </div>  
        </div>
      </div>
    );
  }
}

export default XrayDetails;
