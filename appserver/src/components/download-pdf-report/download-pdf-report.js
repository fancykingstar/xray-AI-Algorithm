import React, {Component} from "react";
import "./download-pdf-report.scss";

class DownloadPdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignupButton: false
    };
  }

  render() {
    return (
      <div className="">
        <div className="pdf-component">
          <div className="row">
            <div className="col-1 text-center">
              <img className='mt-4 ml-4' src={require('../../assets/pdf.png')} width="70"/>
            </div>
            <div className="col-10">
              <div className="card mt-4 mb-4 rounded-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-8">
                      <div className='d-block mb-3'>
                        <img src="/ge.png" width="40" height="40" className="d-inline-block align-center" alt=""/>
                        <span className='ml-3'>GE Healthcare </span>
                        <span className='ml-4 bold letter-spacing text-muted'>X-RAY AI EXPERIENCE</span>
                      </div>
                      <div className='d-block'>
                        <figure className="figure">
                          <img src={require('../../assets/chest.png')} className='pdf-img'/>
                          <figcaption className="figure-caption">
                            <small>
                              1 For demonstration only. Not available for sale.
                            </small>
                          </figcaption>
                          <figcaption className="figure-caption">
                            <small>
                              2 Heatmap/Pneumothorax score is not available for sale in the US Not approved or cleared
                              by the US FDA.
                            </small>
                          </figcaption>
                        </figure>
                      </div>
                    </div>
                    <div className="col-4 text-muted pdf-details-letter-spacing">
                      <ul className="list-inline mt-2 mb-2">
                        <li className="list-inline-item position-relative">
                          <img className='reports-arrow' src={require('../../assets/arrow-icon.svg')} height='30'
                               width='30'/>
                        </li>
                        <li className="list-inline-item ml-2">
                          <h5 className='text-muted letter-spacing bold mb-0'>
                            REPORT DETAILS
                          </h5>
                        </li>
                      </ul>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item border-top-0">
                          <b>QUALITY CARE SUITE</b>
                        </li>
                        <li className="list-group-item">
                          <div className="d-block">
                            <small><b>CHEST: AUTO ROTATE</b></small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-1">
                              <small>RESULT</small>
                            </div>
                            <div>
                              <small>100.00</small>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="d-block">
                            <small><b>CHEST: PROTOCOL CHECK</b></small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-1">
                              <small>RESULT</small>
                            </div>
                            <div>
                              <small>100.00</small>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item border-bottom">
                          <div className="d-block">
                            <small><b>CHEST: FIELD OF VIEW CHECK</b></small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-1">
                              <small>RESULT</small>
                            </div>
                            <div>
                              <small>81.47</small>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="list-group list-group-flush mt-4">
                        <li className="list-group-item border-top-0">
                          <b>CRITICAL CARE SUITE</b>
                        </li>
                        <li className="list-group-item border-bottom">
                          <div className="d-block">
                            <small><b>PNEUMOTHORAX <sup>1,2</sup></b></small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="p-1">
                              <small>RESULT</small>
                            </div>
                            <div>
                              <small>100.00 <sup>2</sup></small>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadPdf;