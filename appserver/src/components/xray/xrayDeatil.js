import React, { Component } from "react";
import "./xray.css";
import Form from "react-bootstrap/Form";
import { Col, Image } from 'react-bootstrap'
class XrayDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openRightPanel: true,
            selectedFile: null,
            imagePreviewUrl: null
         
        };
    }

    componentWillMount() {

    }
    fileChangedHandler = event => {
        this.setState({
          selectedFile: event.target.files[0],
          image:true
        })
     
        let reader = new FileReader();
         
        reader.onloadend = () => {
          this.setState({
            imagePreviewUrl: reader.result
          });
        }
     
        reader.readAsDataURL(event.target.files[0])
     
      }

   rightPanelState = () => {
       this.setState({ openRightPanel : !this.state.openRightPanel })
       }
    

    render() {
        return (
            <div className="bg">
                <div className='d-flex justify-content-center align-items-center'>
               {
                   this.state.imagePreviewUrl ? 
               <img  className='img-fluid h-100' src={this.state.imagePreviewUrl} />
               : 
                <img  className='img-fluid h-100' src={require('../../assets/xray-chest-demo-image.jpeg')} />
               } 
                </div>
                <div className={"right-panel m-2 "+(this.state.openRightPanel ? 'opened':'closed')}>
                    <div className='row'>
                        {/* side image */}
                        <div style={{ margin: 'inherit', marginTop: 130, marginLeft: -20 }}>
                            <img
                                src={require("../../assets/menu-arrow.png")}
onClick={this.rightPanelState}
className={"img-fluid "+(this.state.openRightPanel ? '':'open-menu-arrow')}
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
                                <div className='d-flex m-0 justify-content-center align-items-center' style={{ height: 120, backgroundColor: 'black', alignSelf: 'center' }}>

                                    {
                                        this.state.imagePreviewUrl ? <img
                                            src={this.state.imagePreviewUrl}
                                           className='img-fluid h-100'
                                        /> : <img
                                            src={require('../../assets/xray-chest-demo-image.jpeg')}
                                        className='img-fluid h-100'/>

                                    }
                                </div>
                                <div className='mt-3' style={{ height: 40, marginTop: 20, border: '2px dotted #00B5E2' }}>
                                    <div className='d-flex justify-content-center align-items-center'>
                                    <input type="file" onChange={this.fileChangedHandler}  name="file" id="file" class="inputfile" />
                                    <label for="file text-bold">Input New Image</label>
                                    {/* <input type="file"  className='mr-1' style={{ color: '#00B5E2', }}></input> */}
                                        <img
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