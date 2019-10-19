// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2015 gRPC authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('grpc');
var inferserver_pb = require('./inferserver_pb.js');

function serialize_inferserver_carinaReply(arg) {
  if (!(arg instanceof inferserver_pb.carinaReply)) {
    throw new Error('Expected argument of type inferserver.carinaReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_carinaReply(buffer_arg) {
  return inferserver_pb.carinaReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_chestFrontalReply(arg) {
  if (!(arg instanceof inferserver_pb.chestFrontalReply)) {
    throw new Error('Expected argument of type inferserver.chestFrontalReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_chestFrontalReply(buffer_arg) {
  return inferserver_pb.chestFrontalReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_dcmRequest(arg) {
  if (!(arg instanceof inferserver_pb.dcmRequest)) {
    throw new Error('Expected argument of type inferserver.dcmRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_dcmRequest(buffer_arg) {
  return inferserver_pb.dcmRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_ettubeReply(arg) {
  if (!(arg instanceof inferserver_pb.ettubeReply)) {
    throw new Error('Expected argument of type inferserver.ettubeReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_ettubeReply(buffer_arg) {
  return inferserver_pb.ettubeReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_ettubeTipReply(arg) {
  if (!(arg instanceof inferserver_pb.ettubeTipReply)) {
    throw new Error('Expected argument of type inferserver.ettubeTipReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_ettubeTipReply(buffer_arg) {
  return inferserver_pb.ettubeTipReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_freeAirReply(arg) {
  if (!(arg instanceof inferserver_pb.freeAirReply)) {
    throw new Error('Expected argument of type inferserver.freeAirReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_freeAirReply(buffer_arg) {
  return inferserver_pb.freeAirReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_lungFieldReply(arg) {
  if (!(arg instanceof inferserver_pb.lungFieldReply)) {
    throw new Error('Expected argument of type inferserver.lungFieldReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_lungFieldReply(buffer_arg) {
  return inferserver_pb.lungFieldReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_ptxReply(arg) {
  if (!(arg instanceof inferserver_pb.ptxReply)) {
    throw new Error('Expected argument of type inferserver.ptxReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_ptxReply(buffer_arg) {
  return inferserver_pb.ptxReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_inferserver_rotationReply(arg) {
  if (!(arg instanceof inferserver_pb.rotationReply)) {
    throw new Error('Expected argument of type inferserver.rotationReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_inferserver_rotationReply(buffer_arg) {
  return inferserver_pb.rotationReply.deserializeBinary(new Uint8Array(buffer_arg));
}


// The inference service definition.
var InferChestFrontalService = exports.InferChestFrontalService = {
  inferDCM: {
    path: '/inferserver.InferChestFrontal/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.chestFrontalReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_chestFrontalReply,
    responseDeserialize: deserialize_inferserver_chestFrontalReply,
  },
};

exports.InferChestFrontalClient = grpc.makeGenericClientConstructor(InferChestFrontalService);
var InferRotationService = exports.InferRotationService = {
  inferDCM: {
    path: '/inferserver.InferRotation/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.rotationReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_rotationReply,
    responseDeserialize: deserialize_inferserver_rotationReply,
  },
};

exports.InferRotationClient = grpc.makeGenericClientConstructor(InferRotationService);
var InferLungFieldService = exports.InferLungFieldService = {
  inferDCM: {
    path: '/inferserver.InferLungField/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.lungFieldReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_lungFieldReply,
    responseDeserialize: deserialize_inferserver_lungFieldReply,
  },
};

exports.InferLungFieldClient = grpc.makeGenericClientConstructor(InferLungFieldService);
var InferPneumothoraxService = exports.InferPneumothoraxService = {
  inferDCM: {
    path: '/inferserver.InferPneumothorax/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.ptxReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_ptxReply,
    responseDeserialize: deserialize_inferserver_ptxReply,
  },
};

exports.InferPneumothoraxClient = grpc.makeGenericClientConstructor(InferPneumothoraxService);
var InferFreeAirService = exports.InferFreeAirService = {
  inferDCM: {
    path: '/inferserver.InferFreeAir/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.freeAirReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_freeAirReply,
    responseDeserialize: deserialize_inferserver_freeAirReply,
  },
};

exports.InferFreeAirClient = grpc.makeGenericClientConstructor(InferFreeAirService);
var InferCarinaService = exports.InferCarinaService = {
  inferDCM: {
    path: '/inferserver.InferCarina/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.carinaReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_carinaReply,
    responseDeserialize: deserialize_inferserver_carinaReply,
  },
};

exports.InferCarinaClient = grpc.makeGenericClientConstructor(InferCarinaService);
var InferETTubeService = exports.InferETTubeService = {
  inferDCM: {
    path: '/inferserver.InferETTube/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.ettubeReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_ettubeReply,
    responseDeserialize: deserialize_inferserver_ettubeReply,
  },
};

exports.InferETTubeClient = grpc.makeGenericClientConstructor(InferETTubeService);
var InferETTubeTipService = exports.InferETTubeTipService = {
  inferDCM: {
    path: '/inferserver.InferETTubeTip/inferDCM',
    requestStream: false,
    responseStream: false,
    requestType: inferserver_pb.dcmRequest,
    responseType: inferserver_pb.ettubeTipReply,
    requestSerialize: serialize_inferserver_dcmRequest,
    requestDeserialize: deserialize_inferserver_dcmRequest,
    responseSerialize: serialize_inferserver_ettubeTipReply,
    responseDeserialize: deserialize_inferserver_ettubeTipReply,
  },
};

exports.InferETTubeTipClient = grpc.makeGenericClientConstructor(InferETTubeTipService);
