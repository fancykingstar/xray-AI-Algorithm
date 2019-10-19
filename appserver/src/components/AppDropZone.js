import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import dropimg from './filedrop.png'

const baseStyle = {
   //width: "160px",
   height: "160px",
  borderWidth: 2,
  backgroundColor: "#666699",
  backgroundImage: 'url(' + dropimg + ')',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "auto",
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
                 style={styles}
               >
                 <input {...getInputProps()} />
                 <div style={ {fontSize: 16} }>
                    Drop a DICOM, PNG or JPG file here
                 </div>
               </div>
             )
           }}
         </Dropzone>
      );
   }
};


export default AppDropZone;
