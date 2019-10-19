import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ThreeScene from '../lib/threescene'

class Welcome extends Component {
  render() {
    return (
         <Container fluid={true}>
            <Row>
                  <ThreeScene />
            </Row>
         </Container>
    );
  }
}

export default Welcome;
