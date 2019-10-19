import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from "react-router-bootstrap";
import { IndexLinkContainer } from "react-router-bootstrap";
import { Route, Switch } from 'react-router-dom';

const Algorithms = [
     { path: "/", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: None'} </Navbar.Text> },
     { path: "/rotation", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Chest Frontal Rotation'} </Navbar.Text> },
     { path: "/chestfrontal", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Frontal Chest'} </Navbar.Text> },
     { path: "/lungfield", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Lung Field'} </Navbar.Text> },
     { path: "/ptx", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Pneumothorax'} </Navbar.Text> },
     { path: "/freeair", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Abdominal Free Air'} </Navbar.Text> },
     { path: "/carina",  exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Carina'} </Navbar.Text> },
     { path: "/ettube", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Endotracheal Tube'} </Navbar.Text> },
     { path: "/ettubetip", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Endotracheal Tube Tip'} </Navbar.Text> },
     { path: "/chesttube", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Chest Tube'} </Navbar.Text> },
     { path: "/ribs", exact: true, navtxt: () => <Navbar.Text> {'AI Pipeline: Rib Numbering'} </Navbar.Text> }
];

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

             <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="mr-auto">
                 <NavDropdown title="Products" id="basic-nav-dropdown">
                    <IndexLinkContainer to="/rotation" activeClassName="active">
                        <NavDropdown.Item>Chest Frontal Rotation</NavDropdown.Item>
                    </IndexLinkContainer>
                    <IndexLinkContainer to="/chestfrontal" activeClassName="active">
                        <NavDropdown.Item>Chest Frontal Detection</NavDropdown.Item>
                    </IndexLinkContainer>
                    <IndexLinkContainer to="/lungfield" activeClassName="active">
                        <NavDropdown.Item>Chest Lungfield Check</NavDropdown.Item>
                     </IndexLinkContainer>
                    <NavDropdown.Divider />
                    <IndexLinkContainer to="/ptx" activeClassName="active">
                        <NavDropdown.Item>CCS Pneumothorax</NavDropdown.Item>
                     </IndexLinkContainer>
                    <IndexLinkContainer to="/freeair" activeClassName="active">
                        <NavDropdown.Item>CCS Abdominal Free Air</NavDropdown.Item>
                     </IndexLinkContainer>
                    <IndexLinkContainer to="/carina" activeClassName="active">
                        <NavDropdown.Item>CCS Carina Detection</NavDropdown.Item>
                     </IndexLinkContainer>
                    <IndexLinkContainer to="/ettube" activeClassName="active">
                        <NavDropdown.Item>CCS Endotracheal Tube Detection</NavDropdown.Item>
                     </IndexLinkContainer>
                    <IndexLinkContainer to="/ettubetip" activeClassName="active">
                        <NavDropdown.Item>CCS Endotracheal Tube Tip Detection</NavDropdown.Item>
                     </IndexLinkContainer>
                    <NavDropdown.Divider />
                    <IndexLinkContainer to="/chestube" activeClassName="active">
                        <NavDropdown.Item>CSS Chest Tube Detection</NavDropdown.Item>
                     </IndexLinkContainer>
                    <IndexLinkContainer to="/ribs" activeClassName="active">
                        <NavDropdown.Item>RIB Numbering</NavDropdown.Item>
                    </IndexLinkContainer>
                 </NavDropdown>
               </Nav>
            </Navbar.Collapse>
            <Switch>
               {Algorithms.map((route, index) => (<Route 
                  key={index} path={route.path} exact={route.exact} i
                  component={route.navtxt} />))}
            </Switch>
         </Navbar>
    );
  }
}

export default Header;
