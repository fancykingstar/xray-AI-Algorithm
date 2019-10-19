import React, { Component } from "react";
import "./xray.css";
import Form from "react-bootstrap/Form";
import { Col, Image } from 'react-bootstrap'
class XrayDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: false
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="main-container bg">


                <div style={{ width: '50%' }}>

                </div>

                <div style={{ width: '50%', }} className='left-panel-opacity m-2'>
                    <div className='row'>
                        {/* side image */}
                        <div style={{ margin: 'inherit', marginTop: 130, marginLeft: -20 }}>
                            <img
                                src={require("../../assets/menu-arrow.png")}

                            />
                        </div>
                        {/* ends */}
                        <div  className='col-lg-5'>
                            <div className='row' >
                                <img
                                    src={require("../../assets/arrow-icon.svg")}
                                    width="100"
                                    height="40"
                                />

                                <h5 className='mt-2'>AI  ALGORITHM</h5>

                            </div>

                            <div   className='m-5'>
                                <div className='row  m-0 justify-content-center' style={{ height: 120, backgroundColor: 'black', alignSelf: 'center' }}>

                                    {
                                        this.state.image ? <img
                                            src={require("../../assets/arrow-icon.svg")}
                                            width="100"
                                            height="50"
                                        /> : <p >No Selected Image</p>

                                    }
                                </div>
                                <div className='mt-3' style={{ height: 40, marginTop: 20, border: '2px dotted #00B5E2' }}>
                                    <div className='row justify-content-center'>
                                        <p className='mr-1' style={{ color: '#00B5E2', }}>Input New Image</p>
                                        <img
                                            className='mt-1'
                                            src={require("../../assets/add-icon.svg")}
                                            width="20px"
                                            height="20px"
                                        />
                                    </div>
                                </div>
                                <div className='mt-3' style={{ height: 30, alignSelf: 'center', border: '2px solid #00B5E2' }}>


                                </div>
                            </div>

                        </div>
                        {/* first section end */}
                        <div className='col-lg-5' >
                            <h5 className='mt-3'>QUALITY CARE SUITE</h5>
                            <div>
                                <p className='btm-border'>
                                    <input type="radio" id="test1" name="radio-group" checked />
                                    <label for="test1">CHEST: AUTO ROTATE</label>
                                </p>
                                <p className='btm-border'>
                                    <input type="radio" id="test2" name="radio-group" />
                                    <label for="test2">CHEST: PRO TO CO L CHECK</label>
                                </p>
                                <p className='btm-border'>
                                    <input type="radio" id="test3" name="radio-group" />
                                    <label for="test3">CHEST: FIELD OF VIEW CHECK</label>
                                </p>
                            </div>


                            <div className='mt-5 mb-4 ml-3'>
                                <h5 className='mt-3'>CRITICAL CARE SUITE</h5>
                            </div>

                            <p className='btm-border'>
                                <input type="radio" id="test4" name="radio-group" />
                                <label for="test4">PNEUMOTHOROX</label>
                            </p>
                            <button type="button" className="btn btn-secondary">RESET </button>

                        </div>

                    </div>


                </div>
            </div>
        );
    }
}

export default XrayDetails;