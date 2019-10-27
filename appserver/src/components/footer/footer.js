import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Col, Image } from 'react-bootstrap';
import './footer.css';
class Footer extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    const year = new Date().getFullYear();
    return (
      <div >
        <footer className="page-footer font-small blue fixed-bottom" style={{backgroundColor:'#222222'}}>
          <div className="footer-copyright text-right mr-3" style={{color:'white'}}>
              <span>@{year} </span>
            <span> General Electric Company.</span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;