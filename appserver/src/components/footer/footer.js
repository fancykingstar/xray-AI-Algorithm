import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Col, Image } from 'react-bootstrap'
class Footer extends Component {
    constructor(props) {
        super(props);
       
    }

    

    render() {
        return (
            <div >

<footer className="page-footer font-small blue fixed-bottom" style={{backgroundColor:'#222222'}}>

  <div className="footer-copyright text-right py-3 mr-3" style={{color:'white'}}>
      <span>@2019 </span>
    <span> General Electric Company.</span>
  </div>

</footer>
            </div>
        );
    }
}

export default Footer;