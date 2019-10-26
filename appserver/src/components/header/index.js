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
      <Navbar fluid={"true"} variant="dark" style={{backgroundColor: '#666699', color: 'White', position: 'relative' }}>
        <LinkContainer to="/">
           <Navbar.Brand>
                 <img alt="" src="/logo-ge.svg" 
                    width="41" height="41" 
                    className="d-inline-block align-top" style={{ "marginLeft": "9px", "marginTop": "-2px" }} />
                 <span style={{ "fontSize": "23px", "letterSpacing": "0.2px"}}>{' GE Healthcare'}</span>
           </Navbar.Brand>
        </LinkContainer>
        <p className="x-ray-ai"><span style={{ "fontFamily": 'GE Inspira Bold' }}>X-RAY AI</span> EXPERIENCE</p>
        <p className="not-available">FOR DEMONSTRATION ONLY. NOT AVAILABLE FOR SALE</p>
        <div style={{ position: "absolute", right: "5px" }}>
          <a className="logout" href="/"><img src={require("../../assets/close-icon.svg")} style={{ width: '35px'}} /></a>
        </div>
      </Navbar>
    );
  }
}

export default Header;
