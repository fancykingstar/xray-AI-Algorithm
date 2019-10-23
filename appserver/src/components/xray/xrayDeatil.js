import React, { Component } from "react";
import { Card, Badge, Row, Col, Container } from 'react-bootstrap';
import Upload from './upload';
import { Sidebar, Panel, PanelTitle} from './sidebar';
import AppDropZone from './AppDropZone';
import EE from './ee';
import EventEmitter from 'wolfy87-eventemitter'
import Toolbar from "./Toolbar";
import Dropzone from 'react-dropzone';
import Viewer from '../Viewer';
import Header from '../header/index.js';
import UploadViewer from './UploadViewer';
import "../loadimage.js";
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { uploadImageFile, requestPredict, downloadHeatmap, AUTH_REQUIRED } from '../api'
import "./xray.css";
import "../aiapp.css";


class XrayDetails extends Component {
  constructor(props) {
    super(props);
    const imageid = window.location.origin + "/";
    this.state = {
      openRightPanel: true,
      selectedFile: null,
      imagePreviewUrl: null,
      autoRotate: false,
      colHeck: false,
      viewCheck: false,
      pneumothorox: false,
      showButton: false,

      image_loaded: false,
      inferencing: false,
      predictStatus: {},
      pipeline: 'rotate',
      imageId: imageid,
      heatmapId: null,
      mainimgId: imageid,
      heatmapactive: false,
      height: window.innerHeight - 72.5,
      keycloak: null, 
      authenticated: false
    };

    this.resize = this.resize.bind(this);
    this.dcmfilehandler = this.dcmfilehandler.bind(this);
    this.predictionHandler = this.predictionHandler.bind(this);
    this.toggleHeatmap = this.toggleHeatmap.bind(this);
    this.ee = new EventEmitter();
    this.ee.addListener('togglehmap', this.toggleHeatmap);
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

  anDropFunc = (accepted, rejected) => {
      if( accepted[0] ) { 
         if( accepted[0].type === "image/jpeg" ||
            accepted[0].type === "image/png" ) {
            this.wimgfilehandler(accepted[0]);
         } else {
            this.dcmfilehandler(accepted[0]);
         } 
      }
   }

   toggleHeatmap = (active) => {
      if ( ! this.state.heatmapactive )
         return;

      if ( active ) {
         this.setState(() => {
            return {imageId: this.state.heatmapId}
         });
      } else {
         this.setState(() => {
            return {imageId: this.state.mainimgId}
         });
      }
   }

   onProgress = (data) => {
   }

   webimghandler = async (wimgfile) => {
      const uploadStatus = await uploadImageFile({
         file: wimgfile,
         onProgress: this.onProgress
      });
      var imageid = window.location.origin + "/" + uploadStatus.uploadID;
      this.setState(() => {
         return {imageId: imageid, mainimgId: imageid,
            heatmapId:null, heatmapactive:false, 
            image_loaded: false, inferencing: true}
      });
      this.predictionHandler(uploadStatus);
   }

   dcmfilehandler = async (dcmfile) => {
      debugger
       console.log(dcmfile, "*************************");
      var imageid=cornerstoneWADOImageLoader.wadouri.fileManager.add(dcmfile);
      this.setState(() => {
         return {imageId: imageid, mainimgId: imageid,
            heatmapId:null, heatmapactive:false, 
            image_loaded: false, inferencing: true}
      });
      const uploadStatus = await uploadImageFile({
         file: dcmfile,
         onProgress: this.onProgress
      });
      this.predictionHandler(uploadStatus);
   }

   predictionHandler = async (uploadStatus) => {
      const predictStatus = await requestPredict({
         pipeline: this.state.pipeline,
         uploadId: uploadStatus.uploadID
      }); 
      var heatmapid = null;
      Object.values(predictStatus).forEach(value => {
         if ( (value.inferStatus === "SUCCESS") && value.hasOwnProperty('heatmap') ) {
            heatmapid = window.location.origin + "/" + value.heatmap;
         }
      });
      if( heatmapid === null ) {
         this.setState(() => {
            return {image_loaded: true, predictStatus: predictStatus, inferencing: false}
         });
      } else {
         this.setState(() => {
            return {image_loaded: true, predictStatus: predictStatus, inferencing: false,
               imageId: heatmapid, heatmapId: heatmapid, heatmapactive:true }
         });
      }
   }


   resize() {
      this.setState(() => {
         return {
         height: window.innerHeight - 72.5
         }
      });
      this.render()
   }

   renderPrediction = () => {
      var cardlist =  Object.values(this.state.predictStatus).map( (value, i) => {
               if( value.inferStatus === "SUCCESS" ) { 
                  return (
                     <Card.Text key={i} style={{color: 'yellow', textShadow: "2px 2px 4px #FF0000"}}>
                        {value.class} <Badge pill variant="info"> {value.score.toFixed(2)} </Badge>
                     </Card.Text>
                  );
               } else {
                  return (
                     <Card.Text key={i} style={{color: 'yellow', textShadow: "2px 2px 4px #FF0000"}}>
                        {value.algorithm} <Badge pill variant="info">Failure</Badge> 
                     </Card.Text>
                  );
               }
      });
      return (
         <React.Fragment>
            {cardlist}
         </React.Fragment> 
      );
   }

   reinit = () => {
      const imageid = window.location.origin + "/" + "Rotation.JPG";
      this.setState(() => {
         return {
            image_loaded: false,
            pipeline: this.state.pipeline,
            imageId: imageid,
            predictStatus: {},
            inferencing: false,
            heatmapId: null,
            mainimgId: imageid,
            heatmapactive: false,
         }
      });
   }

  render() {
    return (
      <div className="bg">
        <Header />
        <EE.Provider value={this.ee}>
          <Container fluid={"true"} style={ { paddingLeft: 0, paddingRight: 0 } }>
            <Row style={{ marginLeft: 0, marginRight: 0 }}>
              <Col lg={2} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className='sidebar-toolbar'>
                  <Panel>
                    <PanelTitle>
                       <FontAwesomeIcon icon={faAngleRight} style={{ color:'#3ab3dd', height: '25px', width: '25px' }} />
                       CONTROLS 
                    </PanelTitle>
                    <EE.Consumer>
                       {(val) => <Toolbar evem={val} />}
                    </EE.Consumer>
                 </Panel>
                </div>
              </Col>
              <Col lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <EE.Consumer>
                     {(val) => <Viewer imageid={this.state.imageId} 
                        evem={val} heatmapactive={this.state.heatmapactive} heatmapState={this.state.imageId === this.state.heatmapId}/>}
                  </EE.Consumer>
              </Col>
            </Row>
          </Container>
        </EE.Provider>
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
                  <EE.Provider value={this.ee}>
                    <EE.Consumer>
                       {(val) => <UploadViewer imageid={this.state.imageId} 
                          evem={val} heatmapactive={this.state.heatmapactive} heatmapState={this.state.imageId === this.state.heatmapId}/>}
                    </EE.Consumer>
                  </EE.Provider>
                </div>
                <Dropzone accept=".dcm,.png,.jpg"
                  onDrop={this.anDropFunc}>
                 {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {

                   return (
                     <div
                       {...getRootProps()}
                     >
                       <input {...getInputProps()} />
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
                            <label htmlFor="file text-bold">Input New Image</label>
                            <img
                              alt="plus icon"
                              src={require("../../assets/add-icon.svg")}
                              width="20px"
                              height="20px"
                            />
                          </div>
                        </div>
                     </div>
                   )
                 }}
               </Dropzone>
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
                  <label htmlFor="test1">CHEST: AUTO ROTATE</label>
                  <hr />
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
                  <label htmlFor="test2">CHEST: PROTOCOL CHECK</label>
                  <hr />
                </p>
                <p className="btm-border" style={{ "border-bottom": "1px solid rgba(29, 48, 76, 1)", "padding-bottom": "23px" }}>
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
                  <label htmlFor="test3">CHEST: FIELD OF VIEW CHECK</label>
                  <hr />
                </p>
              </div>

              <div className="mt-5 mb-4 ml-3">
                <h5 className="mt-3">CRITICAL CARE SUITE</h5>
              </div>

              <p className="btm-border" style={{ "border-bottom": "1px solid rgba(29, 48, 76, 1)", "padding-bottom": "23px" }}>
                <input
                  checked = {this.state.pneumothorox}
                  type="radio"
                  id="test4"
                //   name="pneumothorox"
                  className="xray-detail-radio-btn"
                  onClick={this.onPneumothoroxChecked}
                />
                <label htmlFor="test4">PNEUMOTHOROX</label>
                <hr />
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
