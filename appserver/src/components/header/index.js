import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from "react-router-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import { Route, Switch } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
         <Navbar fluid={"true"} collapseOnSelect variant="dark" style={{backgroundColor: '#666699', color: 'White' }}>
            <LinkContainer to="/">
               <Navbar.Brand>
                     <img alt="" src="/ge.png" 
                        width="40" height="40" 
                        className="d-inline-block align-top" />
                     {' GE Healthcare'}
               </Navbar.Brand>
            </LinkContainer>
         </Navbar>
    );
  }
}

export default Header;
