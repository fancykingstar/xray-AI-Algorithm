import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from "react-router-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import './index.css';

class Header extends Component {
  render() {
    return (
         <Navbar fluid={"true"} variant="dark" style={{backgroundColor: '#666699', color: 'White' }}>
            <LinkContainer to="/">
               <Navbar.Brand>
                     <img alt="" src="/logo-ge.svg" 
                        width="40" height="40" 
                        className="d-inline-block align-top" />
                     <span>{' GE Healthcare'}</span>
               </Navbar.Brand>
            </LinkContainer>
            <p style={{ "marginBottom": 0, "marginLeft": "45px" }}><span style={{ "fontWeight": "bold" }}>X-RAY AL</span> EXPERIENCE</p>
         </Navbar>
    );
  }
}

export default Header;
