import React, { Component } from "react";
import { Card, Badge, Row, Col, Container, Dropdown } from 'react-bootstrap';
import Upload from './upload';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Sidebar, Panel, PanelTitle} from './sidebar';
import AppDropZone from './AppDropZone';
import EE from './ee';
import EventEmitter from 'wolfy87-eventemitter'
import Toolbar from "./Toolbar";
import ToolbarHeatMap from "./ToolbarHeatMap";
import Dropzone from 'react-dropzone';
import Viewer from '../Viewer';
import Header from '../header/index.js';
import UploadViewer from './UploadViewer';
import "../loadimage.js";
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { uploadImageFile, requestPredict, AUTH_REQUIRED } from '../api';
import DownloadPdf from '../download-pdf-report/download-pdf-report.js';
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
      pipeline: '',
      imageId: imageid,
      heatmapId: null,
      mainimgId: imageid,
      heatmapactive: false,
      height: window.innerHeight - 72.5,
      keycloak: null, 
      authenticated: false,

      testImages: [

      ],

      test: "",

      dropdownStatus: false,
      uploadStatus: '',
      start: false,
      rotate: '',
      chestfrontal: '',
      lungfield: '',
      ptx: '', 
      status: false,
      dropzoneStatus: false,
    };

    this.resize = this.resize.bind(this);
    this.dcmfilehandler = this.dcmfilehandler.bind(this);
    this.predictionHandler = this.predictionHandler.bind(this);
    this.toggleHeatmap = this.toggleHeatmap.bind(this);
    this.ee = new EventEmitter();
    this.ee.addListener('togglehmap', this.toggleHeatmap);
  }

  componentWillMount() {}

  downloadPDF = () => {
    localStorage.setItem("rotation", this.state.rotate);
    localStorage.setItem("chestfrontal", this.state.chestfrontal);
    localStorage.setItem("lungfield", this.state.lungfield);
    localStorage.setItem("ptx", this.state.ptx);

    localStorage.setItem('imageid', this.state.imageId);
    localStorage.setItem('heatmapactive', this.state.heatmapactive);
    var heatmapState = this.state.imageId === this.state.heatmapId
    localStorage.setItem('heatmapState', heatmapState);

    this.props.history.push('/download-pdf');
  }

  fileChangedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      image: true
    });

    }

  rightPanelState = () => {
    this.setState({ openRightPanel: !this.state.openRightPanel });
  };
  autoRotate = () => {
    if (this.state.status) {
      if (this.state.pneumothorox) {
        this.setState({
          viewCheck: false,
          colHeck: false,
          pneumothorox: false,
          pipeline: 'rotation',
        });

        if (this.state.autoRotate) this.setState({showButton: true, pipeline: 'rotation'});
        else this.setState({showButton: false});
      }
      else {
        this.setState({
          autoRotate: !this.state.autoRotate,
          viewCheck: false,
          colHeck: false,
          pneumothorox: false,
        });
        if (!this.state.autoRotate) {
          this.setState({showButton: true, pipeline: 'rotation'});
        }
        else this.setState({showButton: false, pipeline: ''});
      }

      this.setState({start: false});
    }
  };
  colHeck = () => {
    if (this.state.status) {
      if (this.state.pneumothorox) {
        this.setState({
          autoRotate: false,
          viewCheck: false,
          pneumothorox: false,
          pipeline: 'chestfrontal',
        });

        if (this.state.colHeck) this.setState({showButton: true, pipeline: 'chestfrontal'});
        else this.setState({showButton: false});
      }
      else {
        this.setState({
          colHeck:!this.state.colHeck,
          autoRotate: false,
          viewCheck: false,
          pneumothorox: false,
        });

        if (!this.state.colHeck) this.setState({showButton: true, pipeline: 'chestfrontal'});
        else this.setState({showButton: false, pipline: ''});
      }

      this.setState({start: false});
    }
  };

  viewCheck = () => {
    if (this.state.status) {
      if (this.state.pneumothorox) {
        this.setState({
          autoRotate: false,
          colHeck: false,
          pneumothorox: false,   
        });

        if (this.state.viewCheck) this.setState({showButton: true, pipeline: 'lungfield'});
        else this.setState({showButton: false});
      } else {
        this.setState({
          viewCheck: !this.state.viewCheck,
          autoRotate: false,
          colHeck: false,
          pneumothorox: false,
        });

        if (!this.state.viewCheck) this.setState({showButton: true, pipeline: 'lungfield'});
        else this.setState({showButton: false, pipeline: ''});
      }

      this.setState({start: false});
    }
  };

  onPneumothoroxChecked = e => {
    if (this.state.status) {
      this.setState({
        pneumothorox: !this.state.pneumothorox,
        autoRotate: !this.state.pneumothorox,
        viewCheck: !this.state.pneumothorox,
        colHeck: !this.state.pneumothorox,
      });

      if (!this.state.pneumothorox) this.setState({showButton: true, pipeline: 'ptx'});
      else this.setState({showButton: false, pipeline: ''});

      this.setState({start: false});
    }
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
      this.setState({dropzoneStatus: true});
      if( accepted[0] ) { 
         if( accepted[0].type === "image/jpeg" ||
            accepted[0].type === "image/png" ) {
            this.wimgfilehandler(accepted[0]);
         } else {
             let count = 0;
             this.state.testImages.map((image, index) => {
               if (image.name === accepted[0].name) count ++;
             });
             if (count === 0) this.setState({testImages: [...this.state.testImages, accepted[0]]});
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
      this.setState({uploadStatus: uploadStatus, status: true})
   }

   dcmfilehandler = async (dcmfile) => {
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
      this.setState({uploadStatus: uploadStatus, status: true})
   }

   predictionHandler = async (uploadStatus) => {

      const predictStatus = await requestPredict({
         pipeline: this.state.pipeline,
         uploadId: uploadStatus.uploadID
      });

      if (this.state.pipeline === 'rotation') 
        this.setState({rotate: predictStatus[0].score, start: true});

      else if (this.state.pipeline === 'chestfrontal') 
        this.setState({chestfrontal: predictStatus[0].score, start: true});

      else if (this.state.pipeline === 'lungfield') 
        this.setState({lungfield: predictStatus[1].score, start: true});

      else if (this.state.pipeline === 'ptx') {
        const rotate = await requestPredict({
           pipeline: "rotation",
           uploadId: uploadStatus.uploadID
        });

        this.setState({chestfrontal: predictStatus[0].score, start: true, lungfield: predictStatus[1].score, ptx: predictStatus[2].score, rotate: rotate[0].score});
      }

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

    entering = (e) => {
      e.children[0].style.borderTopColor = '#f6f8fa';
      e.children[1].style.backgroundColor = '#f6f8fa';

      e.children[1].style.color = "black";
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

   reinit = (image) => {

      this.dcmfilehandler(image);
   }

  startInerecing = () => {

    this.setState(() => {
       return {
          heatmapId:null, heatmapactive:false, 
          image_loaded: false, inferencing: true, start: true}
    });
    this.predictionHandler(this.state.uploadStatus);
  }

  render() {
    console.log("=================");
    console.log(this.state.image_loaded);
    return (
      <div className="bg">
        <Header />
        {
          this.state.status ?
            <EE.Provider value={this.ee}>
              <Container fluid={"true"} style={ { paddingLeft: 0, paddingRight: 0 } }>
                <Row style={{ marginLeft: 0, marginRight: 0 }}>
                  <Col lg={2} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div className='sidebar-toolbar'>
                      <Panel>
                        <PanelTitle>
                          <img
                            alt="arrow icon"
                            src={require("../../assets/arrow-icon.svg")}
                            width="30"
                            height="40"
                            style={{ "marginTop": "-3px" }}
                          />
                          <span>CONTROLS</span>
                        </PanelTitle>
                        <EE.Consumer>
                           {(val) => <Toolbar evem={val} />}
                        </EE.Consumer>
                     </Panel>

                     <Panel>
                        <PanelTitle>
                          <img
                            alt="arrow icon"
                            src={require("../../assets/arrow-icon.svg")}
                            width="30"
                            height="40"
                            style={{ "marginTop": "-3px" }}
                          />
                          <span>HEATMAP*</span>
                        </PanelTitle>
                        <EE.Consumer>
                           {(val) => <ToolbarHeatMap evem={val} heatmapactive={this.state.heatmapactive} heatmapState={this.state.imageId === this.state.heatmapId} />}
                        </EE.Consumer>
                     </Panel>
                    </div>
                  </Col>
                  <Col lg={9} style={{ paddingLeft: 0, paddingRight: 0 }} style={{ position: "relative" }}>
                      <EE.Consumer>
                         {(val) => <Viewer imageid={this.state.imageId} 
                            evem={val} heatmapactive={this.state.heatmapactive} heatmapState={this.state.imageId === this.state.heatmapId}/>}
                      </EE.Consumer>
                      <div className="NOT-FOR-CLINICAL-USE">
                        NOT FOR CLINICAL USE
                      </div>
                  </Col>
                </Row>
              </Container>
            </EE.Provider> : this.state.dropzoneStatus ?
            <div style={{ position: 'absolute', bottom: '46%', left: '46%', zIndex: 1000}}>
              <img
                  alt="arrow icon"
                  src={require("../../assets/loading.gif")}
                  width="100"
                  height="100"
                />
            </div> : ""
        }
        <div style={{position: 'absolute', right: '50px', bottom: 0}}>
          <img src={require("../../assets/edison-logo.png")} style={{ width: '120px' }} />
        </div>
        <div
          className={
            "right-panel m-2 " +
            (this.state.openRightPanel ? "opened" : "closed")
          }
          style={{ height: '100%' }}
        >
          <div style={{height: '100%'}}>
            {/* side image */}
            <div className="arrow-bar" style={{ position: 'absolute', transform: 'translate(-25px, 200px)', zIndex: 999 }}>
              <img
                alt="menu arrow icon"
                src={require("../../assets/menu-arrow.png")}
                onClick={this.rightPanelState}
                style={{ height: '400px' }}
                className={
                  "img-fluid " +
                  (this.state.openRightPanel ? "" : "open-menu-arrow")
                }
              />
             {  !this.state.openRightPanel && <h1 style={{ transform: "rotate(90deg) translate(-215px, 50px)", fontSize: 22, letterSpacing: 5 }}> AI ALGORITHMS</h1>}
            </div>
            {/* ends */}
          <div className="row" style={{ "height": "calc(100% - 24px)" }}>
            <div className="col-lg-6">
              <div className="row" style={{ marginLeft: 35 }}>
                <img
                  alt="arrow icon"
                  src={require("../../assets/arrow-icon.svg")}
                  width="50"
                  height="40"
                />

                <h5 className="mt-2" style={{ fontSize: 18, color: 'white', fontFamily: 'GE Inspira Bold', letterSpacing: 2 }}> AI ALGORITHMS </h5>
              </div>
              <div style={{ position: 'relative', height: '100%', borderRight: '1px solid #3f4f66', marginRight: '20px' }}>
                <div className="m-5 text-center right-panel-right">
                  <div
                    className="d-flex m-0 justify-content-center align-items-center image-section"
                    style={{
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
                              border: "2px dotted #00B5E2", borderRadius: "5px"
                            }}
                          >
                            <div className="d-flex justify-content-center align-items-center" style={{ paddingTop: 4 }}>
                              <input
                                type="file"
                                onChange={this.fileChangedHandler}
                                name="file"
                                id="file"
                                className="inputfile"
                              />
                              <label htmlFor="file text-bold" style={{ marginBottom: 0, marginRight: 10 }}>INPUT NEW IMAGE</label>
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
                      height: 40,
                      alignSelf: "center",
                      color:"#00B5E2",
                      textAlign:"center"
                    }}
                    id="dropdownBox"
                  >
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        DEMO IMAGES
                      </Dropdown.Toggle>

                      <Dropdown.Menu drop="down">
                        {this.state.testImages.map((image, index) => {
                          return <Dropdown.Item key={index} onClick={() => this.reinit(image)}>{image.name}</Dropdown.Item>
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                </div>

                 {this.state.showButton &&  <div className="start-button first"><button
                    className="mt-2 orange-btn-style small start-button"
                    type="button" onClick={this.startInerecing}
                  >
                    START <br /> INFERENCING
                  </button></div>
                }
                {
                  this.state.start && (this.state.chestfrontal !== '' || this.state.rotation !== '' || this.state.lungfield !== '') ?
                  <div className="start-button"><button
                    className="mt-2 orange-btn-style small"
                    type="button" onClick={this.downloadPDF}
                    style={{ background: "none", border: '1px solid #ed7d31'}}
                  >DOWNLOAD <br />AI REPORT</button></div> : ""
                }

              </div>
            </div>
            {/* first section end */}
             <div id="rightAlgorithm" className={"col-lg-5" + (this.state.openRightPanel ? "" : "quality-alignment")} style={{ marginBottom: 50}}>
              <h5 className="mt-3" style={{ fontSize: 18, color: 'white', fontFamily: 'GE Inspira Bold', letterSpacing: 2 }}>QUALITY CARE SUITE</h5>
              <div>
                <div className="btm-border text-left small">
                  <input
                    defaultChecked={
                      this.state.pneumothorox === true ||
                       this.state.autoRotate === true 
                    }
                    checked={
                      this.state.pneumothorox === true ||
                       this.state.autoRotate === true 
                    }
                    type="checkbox"
                    id="test1"
                    value="autoRotate"
                    name="checkbox"
                    className="xray-detail-radio-btn"
                    onClick={this.autoRotate}
                  />
                  <OverlayTrigger
                    key='right'
                    placement='bottom'
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        CHEST: AUTO ROTATE
                      </Tooltip>
                    }
                    onEntering={this.entering}
                  >
                    <label htmlFor="test1">CHEST: AUTO ROTATE
                    </label>
                  </OverlayTrigger>
                  {
                    this.state.start && (this.state.pipeline === 'rotataion' || this.state.pipeline === 'ptx') && this.state.rotate === '' ?
                      <div style={{ textAligh: 'right'}}>
                        <img
                            alt="arrow icon"
                            src={require("../../assets/loading.gif")}
                            width="20"
                            height="20"
                            style={{ "marginTop": "-3px" }}
                          />
                      </div> : ""
                  }
                  <hr />
                  {
                    (this.state.pipeline === 'rotation' || this.state.pipeline === 'ptx') && this.state.start ?
                      <div className="result">
                        <div>RESULT</div>
                        <hr />
                        <div>{Number(this.state.rotate).toFixed(2)}</div>
                      </div> : ""
                  }
                </div>
                <div className="btm-border text-left small">
                  <input
                    defaultChecked={
                      this.state.pneumothorox === true ||
                      this.state.colHeck === true 
                    }
                    checked={
                      this.state.pneumothorox === true ||
                      this.state.colHeck === true 
                    }
                    type="checkbox"
                    id="test2"
                    name="checkbox"
                    value="colheck"
                    className="xray-detail-radio-btn"
                    onClick={this.colHeck}
                  />
                  <OverlayTrigger
                    key='right'
                    placement='bottom'
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        CHEST: PROTOCOL CHECK
                      </Tooltip>
                    }
                    onEntering={this.entering}
                  >
                    <label htmlFor="test2">CHEST: PROTOCOL CHECK</label>
                  </OverlayTrigger>
                  {
                    this.state.start && (this.state.pipeline === 'chestfrontal' || this.state.pipeline === 'ptx') && this.state.chestfrontal === '' ?
                      <div style={{ textAligh: 'right'}}>
                        <img
                            alt="arrow icon"
                            src={require("../../assets/loading.gif")}
                            width="20"
                            height="20"
                            style={{ "marginTop": "-3px" }}
                          />
                      </div> : ""
                  }
                  <hr />
                  {
                    (this.state.pipeline === 'chestfrontal' || this.state.pipeline === 'ptx') && this.state.start ?
                      <div className="result">
                        <div>RESULT</div>
                        <hr />
                        <div>{Number(this.state.chestfrontal).toFixed(2)}</div>
                      </div> : ""
                  }
                </div>
                <div className="btm-border text-left small" style={{ "borderBottom": "1px solid #3f4f66", "paddingBottom": "10px" }}>
                  <input
                    defaultChecked={
                      this.state.pneumothorox === true ||
                     this.state.viewCheck === true 
                    }
                    checked={
                      this.state.pneumothorox === true ||
                     this.state.viewCheck === true 
                    }
                    type="checkbox"
                    id="test3"
                    name="checkbox"
                    value="viewcheck"
                    className="xray-detail-radio-btn"
                    onClick={this.viewCheck}
                  />
                  <OverlayTrigger
                    key='right'
                    placement='bottom'
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        CHEST: FIELD OF VIEW CHECK
                      </Tooltip>
                    }
                    onEntering={this.entering}
                  >
                    <label htmlFor="test3">CHEST: FIELD OF VIEW CHECK</label>
                  </OverlayTrigger>
                  {
                    this.state.start && (this.state.pipeline === 'lungfield' || this.state.pipeline === 'ptx') && this.state.lungfield === '' ?
                      <div style={{ textAligh: 'right'}}>
                        <img
                            alt="arrow icon"
                            src={require("../../assets/loading.gif")}
                            width="20"
                            height="20"
                            style={{ "marginTop": "-3px" }}
                          />
                      </div> : ""
                  }
                  <hr />
                  {
                    (this.state.pipeline === 'lungfield' || this.state.pipeline === 'ptx') && this.state.start ?
                      <div className="result">
                        <div>RESULT</div>
                        <hr />
                        <div>{Number(this.state.lungfield).toFixed(2)}</div>
                      </div> : ""
                  }
                </div>
              </div>

              <div className="mt-5 mb-4 btm-border">
                <h5 className="mt-3" style={{ fontSize: 18, color: 'white', fontFamily: 'GE Inspira Bold', letterSpacing: 2 }}>CRITICAL CARE SUITE</h5>
              </div>
              <div className="btm-border text-left small" style={{ "borderBottom": "1px solid #3f4f66", "paddingBottom": "10px" }}>
                <input
                  defaultChecked = {this.state.pneumothorox}
                  checked = {this.state.pneumothorox}
                  type="checkbox"
                  id="test4"
                  value="pneumothorox"
                  name="checkbox"
                  className="xray-detail-radio-btn"
                  onClick={this.onPneumothoroxChecked}
                />
                <OverlayTrigger
                    key='right'
                    placement='bottom'
                    overlay={
                      <Tooltip id={`tooltip-right`}>
                        PNEUMOTHOROX
                      </Tooltip>
                    }
                    onEntering={this.entering}
                  >
                    <label htmlFor="test4">PNEUMOTHOROX</label>
                  </OverlayTrigger>
                  {
                    this.state.start && this.state.pipeline === 'ptx' && this.state.ptx === '' ?
                      <div style={{ textAligh: 'right'}}>
                        <img
                            alt="arrow icon"
                            src={require("../../assets/loading.gif")}
                            width="20"
                            height="20"
                            style={{ "marginTop": "-3px" }}
                          />
                      </div> : ""
                  }
                  <hr />
                  {
                    this.state.pipeline === 'ptx' && this.state.start ?
                      <div className="result">
                        <div>RESULT</div>
                        <hr />
                        <div>{Number(this.state.ptx).toFixed(2)}</div>
                      </div> : ""
                  }
              </div>
              <button type="button" className="btn btn-secondary" onClick={this.resetRadio}>
                RESET
              </button>
            </div> 
          </div>
          </div> 
        </div>
      </div>
    );
  }
}

export default XrayDetails;