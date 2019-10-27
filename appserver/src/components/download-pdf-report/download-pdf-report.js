import React, {Component} from "react";
import EE from '../ee';
import Viewer from '../Viewer';
import UploadViewer from '../xray/UploadViewer';
import EventEmitter from 'wolfy87-eventemitter'
import "./download-pdf-report.scss";
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf'

class DownloadPdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignupButton: false,
      imageId: localStorage.getItem('imageId'),
      rotation: localStorage.getItem('rotation'),
      chestfrontal: localStorage.getItem('chestfrontal'),
      lungfield: localStorage.getItem('lungfield'),
      ptx: localStorage.getItem('ptx'),
      heatmapactive: localStorage.getItem('heatmapactive'),
      heatmapState: localStorage.getItem('heatmapState'),
    };

    this.toggleHeatmap = this.toggleHeatmap.bind(this);
    this.ee = new EventEmitter();
    this.ee.addListener('togglehmap', this.toggleHeatmap);
  }

  componentDidMount() {
    setTimeout(this.downloadPDF, 10000);
  }

  downloadPDF = () => {
    const divHeight = this.divElement.clientHeight;
    const divWidth = this.divElement.clientWidth;
    var ratio = divHeight / divWidth;

    const pdf = document.getElementById('donwloadPdf');
      const imageCanvas = document.getElementById('imageCanvas');
      html2canvas(pdf, {
        height: divHeight,
        width: divWidth
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');

          const pdf = new jsPDF(
            {orientation: 'landscape',}
          );

          const width = pdf.internal.pageSize.getWidth();    
          let height = pdf.internal.pageSize.getHeight();
          height = ratio * width;

          pdf.addImage(imgData, 'PNG', 0, 0, width-20, height-10);
          pdf.save("download.pdf");  
        });
  }

  toggleHeatmap = (active) => {
      return;
   }

  render() {

    return (
      <div id="donwloadPdf" ref={ (divElement) => this.divElement = divElement}>
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
                        <div style={{ height: "calc(100vh - 400px)" }} id="imageCanvas">
                          <EE.Provider value={this.ee}>
                            <EE.Consumer>
                               {(val) => <Viewer imageid={localStorage.getItem('imageid')} 
                                  evem={val} heatmapactive={localStorage.getItem('heatmapactive')} heatmapState={localStorage.getItem('heatmapState')}/>}
                            </EE.Consumer>
                          </EE.Provider>
                        </div>
                        <span className='ml-3'>GE Healthcare </span>
                        <span className='ml-4 bold letter-spacing text-muted'>X-RAY AI EXPERIENCE</span>
                      </div>
                      <div className='d-block'>
                        <figure className="figure">
                   
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
                              <small>{Number(localStorage.getItem('rotation')).toFixed(2)}</small>
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
                              <small>{Number(localStorage.getItem('chestfrontal')).toFixed(2)}</small>
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
                              <small>{Number(localStorage.getItem('lungfield')).toFixed(2)}</small>
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
                              <small>{Number(localStorage.getItem('ptx')).toFixed(2)} <sup>2</sup></small>
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