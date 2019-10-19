import axios from 'axios';
import fileDownload from 'js-file-download'

export const uploadImageFile = ({file, onProgress}) => {
  const uploadUrl = `/upload`
  return new Promise(function (resolve, reject) {
    const req = new window.XMLHttpRequest()
    req.upload.addEventListener('progress', (event) => {
      if (typeof onProgress === 'function' && event.lengthComputable) {
        onProgress(event.loaded / event.total)
      }
    })
    req.addEventListener('load', () => {
      if (req.status === 401) {
        return reject(new Error('Your session has been expired. Please re-login.'))
      } else if (req.status !== 200) {
        return reject(new Error('An error has occured. Please contact the administrator.'))
      }
      let response = req.response
      if (typeof response === 'string') { // for IE11
        response = JSON.parse(response)
      }
      resolve(response)
    })
    req.addEventListener('error', () => {
      reject(new Error('An error has occured. Please contact the administrator.'))
    })
    req.open('POST', uploadUrl, true)
     //req.setRequestHeader('Content-Type', 'application/dicom')
    req.responseType = 'json'
    req.json = true
    var formData = new FormData();
    formData.append('imageFile',file);
    req.send(formData)
  })
}

export const requestPredict = ({pipeline, uploadId}) => {
  const requestUrl = '/predict'
  const predictData = {
       'pipeline': pipeline,
       'uploadId': uploadId
  }
   return new Promise(function (resolve, reject) {
      axios.post(requestUrl, predictData)
         .then( function(res) {
            resolve(res.data);
         })
         .catch( function(err) {
            console.log(err.message);
            reject( new Error("Failed to Predict") );
         } );
   });
}

export const downloadHeatmap = (pipeline) => {
   var myHeaders = new Headers();
   myHeaders.append('pragma', 'no-cache');
   myHeaders.append('cache-control', 'no-cache');

   axios({
        url: '/downloadhmap?pipeline=' + pipeline,
        method: 'GET',
        headers: myHeaders,
        responseType: 'blob', // important
   }).then((response) => {
      if( pipeline === 'ptx' ) {
         fileDownload(response.data,'ptxheatmap.png');
      } else if ( pipeline === 'freeair' ) {
         fileDownload(response.data,'freeair_heatmap.png');
      } else if ( pipeline === 'carina' ) {
         fileDownload(response.data,'carina_heatmap.png');
      } else if ( pipeline === 'ettube' ) {
         fileDownload(response.data,'ettube_heatmap.png');
      } else if ( pipeline === 'ettubetip' ) {
         fileDownload(response.data,'ettubetip_heatmap.png');
      }
   });
}

export const AUTH_REQUIRED=false
