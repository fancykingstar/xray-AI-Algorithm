import React, { Component } from 'react';
import Dropzone from 'react-dropzone'

const baseStyle = {
   //width: "160px",
   height: "160px",
  borderWidth: 2,
  backgroundColor: "#666699",
  borderColor: '#fff',
  borderStyle: 'dashed',
  borderRadius: 5,
  paddingLeft: "0px",
  color: "white"
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#666699'
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#666699'
};

class AppDropZone extends Component {
   constructor(props) {
      super(props)
      this.dcmfilehandler = props.dcmhandler;
      this.wimgfilehandler = props.wimghandler;
   }

   anDropFunc = (accepted, rejected) => {
      if( accepted[0] ) { 
         if( accepted[0].type === "image/jpeg" ||
            accepted[0].type === "image/png" ) {
            this.wimgfilehandler(accepted[0]);
         } else {
            this.dcmfilehandler(accepted[0]);
         } 
      }
   }

   render() {
      return (
         <Dropzone accept=".dcm,.png,.jpg"
            onDrop={this.anDropFunc}>
           {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
             let styles = {...baseStyle}
             styles = isDragActive ? {...styles, ...activeStyle} : styles
             styles = isDragReject ? {...styles, ...rejectStyle} : styles

             return (
               <div
                 {...getRootProps()}
               >
                 <input {...getInputProps()} />
                 <div
                    className="mt-3"
                    style={{
                      height: 40,
                      marginTop: 20,
                      border: "2px dotted #00B5E2"
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        type="file"
                        onChange={this.fileChangedHandler}
                        name="file"
                        id="file"
                        className="inputfile"
                      />
                      <label for="file text-bold">Input New Image</label>
                      {/* <input type="file"  className='mr-1' style={{ color: '#00B5E2', }}></input> */}
                      <img
                        alt="plus icon"
                        src={require("../../assets/add-icon.svg")}
                        width="20px"
                        height="20px"
                      />
                    </div>
                  </div>
               </div>
             )
           }}
         </Dropzone>
      );
   }
};


export default AppDropZone;
