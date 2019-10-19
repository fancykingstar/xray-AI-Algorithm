import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import AppDropZone from './AppDropZone'
import {Sidebar, Panel, PanelTitle} from './Sidebar'
import Viewer from './Viewer'
import "./loadimage.js"
import "./aiapp.css"
//import cornerstone from 'cornerstone-core'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Toolbar from "./Toolbar.js"
//import * as dicomParser from 'dicom-parser'
import EE from './ee.js'
import EventEmitter from 'wolfy87-eventemitter'
import { uploadImageFile, requestPredict, downloadHeatmap, AUTH_REQUIRED } from './api'
import "./toolbar.css"
import Keycloak from 'keycloak-js';

class AiApp extends Component {
   constructor(props) {
      super(props);

      const imageid = window.location.origin + "/" + this.props.splash;
      this.state = {
         image_loaded: false,
         inferencing: false,
         predictStatus: {},
         pipeline: props.pipeline,
         imageId: imageid,
         heatmapId: null,
         mainimgId: imageid,
         heatmapactive: false,
         height: window.innerHeight - 72.5,
         keycloak: null, 
         authenticated: false
      }
      this.resize = this.resize.bind(this);
      this.dcmfilehandler = this.dcmfilehandler.bind(this);
      this.predictionHandler = this.predictionHandler.bind(this);
      this.toggleHeatmap = this.toggleHeatmap.bind(this);
      this.ee = new EventEmitter();
      this.ee.addListener('togglehmap', this.toggleHeatmap);
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
         pipeline: this.props.pipeline,
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
      const imageid = window.location.origin + "/" + this.props.splash;
      this.setState(() => {
         return {
            image_loaded: false,
            pipeline: this.props.pipeline,
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
      if (this.state.keycloak && this.state.authenticated) {
         if ( this.props.pipeline !== this.state.pipeline )  {
            this.reinit()
         }
         return (
            <EE.Provider value={this.ee}> 
               <Container fluid={"true"} style={ { paddingLeft: 0, paddingRight: 0 } }>
                  <Row style={ { marginLeft: 0, marginRight: 0 } }>
                     <Col lg={10} style={ { height: this.state.height, paddingLeft: 0, paddingRight: 0} } >
                          <EE.Consumer>
                             {(val) => <Viewer imageid={this.state.imageId} 
                                evem={val} heatmapactive={this.state.heatmapactive} heatmapState={this.state.imageId === this.state.heatmapId}/>}
                          </EE.Consumer>
                     </Col>
                     <Col lg={2} style={ { height: this.state.height, paddingLeft: 0, paddingRight: 0 } }>
                         <Sidebar style={ { marginLeft: 0, marginRight: 0 } }> 
                           <Panel style={ {marginTop: 0}} >
                              <PanelTitle>
                                 INPUT IMAGE
                              </PanelTitle>
                              <AppDropZone dcmhandler={this.dcmfilehandler} wimghandler={this.webimghandler} />
                           </Panel>
                           { this.state.inferencing && <Panel style={{backgroundColor: '#6666cc'}}>
                              <div style={{display:"flex", justifyContent: 'start'}}>
                                 <div className="spinner-grow text-warning" style={{marginRight: '4px'}}  role="status"/>
                                 <span className="text-warning">Inferencing...</span>
                              </div>
                           </Panel>}
                           <Panel>
                              <PanelTitle>
                                 CONTROLS 
                              </PanelTitle>
                              <EE.Consumer>
                                 {(val) => <Toolbar evem={val} />}
                              </EE.Consumer>
                           </Panel>
                           { this.state.image_loaded && <Panel>
                              <Card bg="mycard" text="white" border="primary" style={{flexShrink: 0 }}>
                                 <Card.Header>AI Results</Card.Header>
                                 <Card.Body>
                                    <Card.Text>Pipeline: {this.props.algorithm}</Card.Text>
                                    {this.renderPrediction()}
                                    {this.state.heatmapactive && <Button variant="secondary" size="sm" onClick={() => downloadHeatmap(this.props.pipeline)}>Download Heatmap</Button>}
                                 </Card.Body>
                              </Card>
                           </Panel> }
                        </Sidebar>
                     </Col>
                  </Row>
               </Container>
            </EE.Provider>
            );
      } else {
         return <div>Initializing Keycloak...</div>;
      }
  }
 
  componentDidMount() {
     window.onresize = this.resize;
     const keycloak = Keycloak('/keycloak.json');
     if ( AUTH_REQUIRED === false ) {
        this.setState({ keycloak: keycloak, authenticated: true });
     } else {
        keycloak.init({onLoad: 'login-required'}).success(authenticated => {
           this.setState({ keycloak: keycloak, authenticated: authenticated })
        }).error(function() {
            alert('failed to initialize');
        });
     }
  }
}

export default AiApp;
