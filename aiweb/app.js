var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var formidable = require('express-formidable');
var bodyParser = require('body-parser')
var debug = require('debug')('serverapp');
var config = require('./config.js')
const uploaddir=config['upload_path']
const heatmapdir=config['heatmap_path']
const app_port=config['app_port']
  
//gRPC Stuff
var messages = require('./inferserver_pb');
var services = require('./inferserver_grpc_pb');
var grpc = require('grpc');

var grpc_client_cf = new services.InferChestFrontalClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_rot = new services.InferRotationClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_lf = new services.InferLungFieldClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_ptx = new services.InferPneumothoraxClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_freeair = new services.InferFreeAirClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_carina = new services.InferCarinaClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_ettube = new services.InferETTubeClient(config['grpc_bind_address'],grpc.credentials.createInsecure());
var grpc_client_ettubetip = new services.InferETTubeTipClient(config['grpc_bind_address'],grpc.credentials.createInsecure());


var app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(heatmapdir));
app.use(express.static(uploaddir));

app.use(formidable({
   encoding: 'utf-8',
   uploadDir: uploaddir,
   multiples: true
}));

app.use( bodyParser.urlencoded({ extended: true }) )

const doInferROT = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_rot.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.RotationResult.UPRIGHT )  {
            resolve( {classVal: "UPRIGHT", score: response.getConfidencescore()} );
         } else if ( response.getResult() === messages.RotationResult.CLOCKWISE_90 )  {
            resolve( {classVal: "CLOCKWISE_90", score: response.getConfidencescore()} );
         } else if ( response.getResult() === messages.RotationResult.UPSIDE_DOWN )  {
            resolve( {classVal: "UPSIDE_DOWN", score: response.getConfidencescore()} );
         } else {
            resolve( {classVal: "CLOCKWISE_270", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferCF = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_cf.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            debug(error.details);
            reject(error);
            return;
         }
         if ( response.getResult() === messages.ChestFrontalResult.FRONTAL )  {
            resolve( {classVal: "FRONTAL", score: response.getConfidencescore()} );
         } else {
            resolve( {classVal: "NON FRONTAL", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferLF = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_lf.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.LungFieldResult.LUNG_FIELDS_OK )  {
            resolve( {classVal: "LUNG FIELDS OK", score: response.getConfidencescore()} );
         } else {
            resolve( {classVal: "LUNG FIELDS CLIPPED", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferPTX = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_ptx.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.PneumothoraxResult.PNEUMOTHORAX_PRESENT )  {
            resolve( {classVal: "PNEUMOTHORAX PRESENT", score: response.getConfidencescore(), heatmap: response.getHeatmappath()} );
         } else {
            resolve( {classVal: "PNEUMOTHORAX ABSENT", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferFreeAir = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_freeair.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.FreeAirResult.FREEAIR_PRESENT )  {
            resolve( {classVal: "FREE AIR PRESENT", score: response.getConfidencescore(), heatmap: response.getHeatmappath()} );
         } else {
            resolve( {classVal: "FREE AIR ABSENT", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferCarina = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_carina.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.CarinaResult.CARINA_PRESENT )  {
            resolve( {classVal: "CARINA SEGMENTED", score: response.getConfidencescore(), heatmap: response.getHeatmappath()} );
         } else {
            resolve( {classVal: "CARINA SEGMENTATION FAILURE", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferETTube = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_ettube.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.ETTubeResult.ETTUBE_PRESENT )  {
            resolve( {classVal: "ETTUBE_PRESENT", score: response.getConfidencescore(), heatmap: response.getHeatmappath()} );
         } else {
            resolve( {classVal: "ETTUBE_ABSENT", score: response.getConfidencescore()} );
         }
      });
   });
}

const doInferETTubeTip = async (dcmrequest) => {
   return new Promise( (resolve, reject) => {
      grpc_client_ettubetip.inferDCM(dcmrequest, (error,response) => {
         if ( error ) {
            reject("Inference Error" + error);
            return;
         }
         if ( response.getResult() === messages.ETTubeTipResult.ETTUBE_TIP_PRESENT )  {
            resolve( {classVal: "ETTUBE TIP SEGMENTED", score: response.getConfidencescore(), heatmap: response.getHeatmappath()} );
         } else {
            resolve( {classVal: "ETTUBE TIP SEGMENTATION FAILURE", score: response.getConfidencescore()} );
         }
      });
   });
}

// POST: handle form data parsed from client
app.post('/upload', function(req, res) {
   var srcfile = req.files['imageFile'].path;
   var dstfile = path.join(uploaddir , req.files['imageFile'].name);
   fs.rename(srcfile, dstfile, function(err) {
      if(err) throw err;
      debug(req.files['imageFile'].name + " Uploaded");
      res.setHeader('Content-Type', 'application/json');
      res.json({'Status': 'GOOD','uploadID': path.basename(dstfile)}); 
   });
});

const removefile = async (fname) => {
   return new Promise( (resolve, reject) => {
      fs.unlink(fname, (err) => {
         if( err ) reject(err);
         resolve("Successfully removed " + fname);
      });
   });
}

const fillGoodResult = (algorithm, jsonresult) => {
   resultitem = {};
   resultitem["algorithm"] = algorithm;
   resultitem["inferStatus"] = "SUCCESS";
   resultitem["class"] = jsonresult.classVal ;
   resultitem["score"] = jsonresult.score ;
   if ( jsonresult.hasOwnProperty('heatmap') ) {
      resultitem["heatmap"] = jsonresult.heatmap;
   }
   return resultitem;
}

const fillBadResult = (algorithm, detail) => {
   resultitem = {};
   resultitem["algorithm"] = algorithm;
   resultitem["detail"] = detail;
   resultitem["inferStatus"] = "FAILURE";
   return resultitem;
}


const sendJSON = (res,obj) => {
   res.setHeader('Content-Type', 'application/json');
   res.json(obj);
}


app.post('/predict', async function(req, res) {
   var dcmrequest, jsonresult;
   dcmrequest = new messages.dcmRequest();
   dcmrequest.setDcmname( path.join(uploaddir,req.fields.uploadId) );

   if ( req.fields.pipeline === 'chestfrontal' ) {
      try {
         jsonresult = await doInferCF(dcmrequest);
         debug(jsonresult);
         retobj = []
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         sendJSON(res,retobj);
      } catch(error) {
         retobj = []
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
   } else if ( req.fields.pipeline === 'rotation' ) {
      try {
         jsonresult = await doInferROT(dcmrequest);
         debug(jsonresult);
         retobj = []
         retobj.push(fillGoodResult("Rotation",jsonresult));
         sendJSON(res,retobj);
      } catch(error) {
         retobj = []
         retobj.push(fillBadResult("Rotation", error.detail));
         sendJSON(res,retobj);
     }
   }else if (req.fields.pipeline === 'lungfield' ) {
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run Lung field check if frontal
               jsonresult = await doInferLF(dcmrequest);
               retobj.push(fillGoodResult("Lung Field",jsonresult));
               sendJSON(res,retobj);
            } catch(error) {
               retobj.push(fillBadResult("Lung Field", error.detail));
               sendJSON(res,retobj);
            }
         } else {
               sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
   } else if (req.fields.pipeline === 'ptx' ) {
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run Lung field check if frontal
               jsonresult = await doInferLF(dcmrequest);
               retobj.push(fillGoodResult("Lung Field",jsonresult));
           } catch(error) {
               retobj.push(fillBadResult("Lung Field", error.detail));
           }
           try { // Run PTX if frontal
               jsonresult = await doInferPTX(dcmrequest);
               debug(jsonresult)
               retobj.push(fillGoodResult("Pneumothorax",jsonresult));
               sendJSON(res,retobj);
            } catch(error) {
               retobj.push(fillBadResult("Pneumothorax", error.detail));
               sendJSON(res,retobj);
            }
         } else {
            sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
   } else if (req.fields.pipeline === 'freeair' ) {
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run Lung field check if frontal
               jsonresult = await doInferLF(dcmrequest);
               retobj.push(fillGoodResult("Lung Field",jsonresult));
           } catch(error) {
               retobj.push(fillBadResult("Lung Field", error.detail));
           }
           try { // Run PNE if frontal
               jsonresult = await doInferFreeAir(dcmrequest);
               debug(jsonresult)
               retobj.push(fillGoodResult("Free Air",jsonresult));
               sendJSON(res,retobj);
            } catch(error) {
               retobj.push(fillBadResult("Free Air", error.detail));
               sendJSON(res,retobj);
            }
         } else {
            sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
  } else if (req.fields.pipeline === 'carina' ) {
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run Carina if frontal
               jsonresult = await doInferCarina(dcmrequest);
               debug(jsonresult)
               retobj.push(fillGoodResult("Carina",jsonresult));
               sendJSON(res,retobj);
            } catch(error) {
               retobj.push(fillBadResult("Carina", error.detail));
               sendJSON(res,retobj);
            }
         } else {
            sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
  } else if (req.fields.pipeline === 'ettube' ) {
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run ET Tube if frontal
               jsonresult = await doInferETTube(dcmrequest);
               debug(jsonresult)
               retobj.push(fillGoodResult("ET Tube",jsonresult));
               sendJSON(res,retobj);
            } catch(error) {
               retobj.push(fillBadResult("ET Tube", error.detail));
               sendJSON(res,retobj);
            }
         } else {
            sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
  } else if (req.fields.pipeline === 'ettubetip' ) {
     debug("ET Tube Tip algorithm called")
      retobj = []
      try { // First try Chest Frontal
         jsonresult = await doInferCF(dcmrequest);
         retobj.push(fillGoodResult("Chest Frontal",jsonresult));
         if ( jsonresult.classVal === "FRONTAL" ) {
           try { // Run ET Tube presence check
               jsonresult = await doInferETTube(dcmrequest);
               retobj.push(fillGoodResult("ET Tube",jsonresult));
           } catch(error) {
               retobj.push(fillBadResult("ET Tube", error.detail));
           }
           if ( jsonresult.classVal === "ETTUBE_PRESENT" ) {
              try { // Run Carina if frontal
                  jsonresult = await doInferETTubeTip(dcmrequest);
                  debug(jsonresult)
                  retobj.push(fillGoodResult("ET Tube Tip",jsonresult));
                  sendJSON(res,retobj);
               } catch(error) {
                  retobj.push(fillBadResult("ET Tube Tip", error.detail));
                  sendJSON(res,retobj);
               }
           } else {
            sendJSON(res,retobj);
           }
         } else {
            sendJSON(res,retobj);
         }
      }catch(error) {
         retobj.push(fillBadResult("Chest Frontal", error.detail));
         sendJSON(res,retobj);
     }
  }
  await removefile(path.join(uploaddir,req.fields.uploadId));
});

app.get('/downloadhmap', function(req, res){
   var file = null;
   if (req.fields.pipeline == 'ptx' ) {
      file = path.join(heatmapdir,'ptx_heatmap.png');
   } else if (req.fields.pipeline == "freeair" ) {
      file = path.join(heatmapdir,'freeair_heatmap.png');
   } else if (req.fields.pipeline == "carina" ) {
      file = path.join(heatmapdir,'carina_heatmap.png');
   } else if (req.fields.pipeline == "ettube" ) {
      file = path.join(heatmapdir,'ettube_heatmap.png');
   } else if (req.fields.pipeline == "ettubetip" ) {
      file = path.join(heatmapdir,'ettubetip_heatmap.png');
   }
   if ( file !== null )
      res.download(file); // Set disposition and send it.
});

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(app_port, () => {
   debug("Starting the server at port: " + app_port)
});
