import React, { Component } from "react";
import { Conatiner, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Sidebar, Panel, PanelTitle} from './sidebar';
import AppDropZone from './AppDropZone'
import "./xray.css";


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  

  render() {
    return (
      <div className="bg">
        <Row style={ { marginLeft: 0, marginRight: 0 } }>
          <Col lg={2} style={ { height: this.state.height, paddingLeft: 0, paddingRight: 0 } }>
            <Sidebar class style={ { marginLeft: 0, marginRight: 0 } }> 
              <Panel style={ {marginTop: 0}} >
                <PanelTitle>
                  INPUT IMAGE
                </PanelTitle>
                <AppDropZone dcmhandler={this.dcmfilehandler} wimghandler={this.webimghandler} />
              </Panel>
            </Sidebar>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Upload;
