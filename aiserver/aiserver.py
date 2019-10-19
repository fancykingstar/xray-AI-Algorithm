# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""The Python implementation of the GRPC helloworld.Greeter server."""

from concurrent import futures
import time

import grpc

import inferserver_pb2
import inferserver_pb2_grpc
import argparse
from cf_infer import ChestFrontalAlgorithm
from lf_infer import LungFieldAlgorthm
from ptx_infer import PneumothoraxAlgorithm
from rot_infer import RotationAlgorithm
from freeair_infer import FreeAirAlgorithm
from carina_infer import CarinaAlgorithm
from ettube_infer import ETTubeAlgorithm
from ettubetip_infer import ETTubeTipAlgorithm


from ai_common import InferenceException

class InfererRotation(inferserver_pb2_grpc.InferRotationServicer):
    def __init__(self):
        self.inferobj = RotationAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.rotationReply() 

        if res == 0:
            inf_result = inferserver_pb2.UPRIGHT
        elif res == 1:
            inf_result = inferserver_pb2.CLOCKWISE_270
        elif res == 2:
            inf_result = inferserver_pb2.UPSIDE_DOWN
        else:
            inf_result = inferserver_pb2.CLOCKWISE_90

        return inferserver_pb2.rotationReply(
            result = inf_result,
            confidenceScore = inf_conf * 100
        )


class InfererChestFrontal(inferserver_pb2_grpc.InferChestFrontalServicer):
    def __init__(self):
        self.inferobj = ChestFrontalAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.chestFrontalReply() 

        if res:
            inf_result = inferserver_pb2.FRONTAL
        else:
            inf_result = inferserver_pb2.NON_FRONTAL

        return inferserver_pb2.chestFrontalReply(
            result = inf_result,
            confidenceScore = inf_conf * 100
        )

class InfererLungField(inferserver_pb2_grpc.InferLungFieldServicer):
    def __init__(self):
        self.inferobj = LungFieldAlgorthm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.lungFieldReply() 

        if res:
            inf_result = inferserver_pb2.LUNG_FIELDS_CLIPPED
        else:
            inf_result = inferserver_pb2.LUNG_FIELDS_OK

        return inferserver_pb2.lungFieldReply(
            result = inf_result,
            confidenceScore = inf_conf * 100
        )

class InfererPneumothorax(inferserver_pb2_grpc.InferPneumothoraxServicer):
    def __init__(self):
        self.inferobj = PneumothoraxAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf,hmap) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf, hmap);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.ptxReply() 

        if res:
            inf_result = inferserver_pb2.PNEUMOTHORAX_PRESENT
        else:
            inf_result = inferserver_pb2.PNEUMOTHORAX_ABSENT

        return inferserver_pb2.ptxReply(
            result = inf_result,
            confidenceScore = inf_conf * 100,
            heatmapPath = hmap
        )

class InfererFreeAir(inferserver_pb2_grpc.InferFreeAirServicer):
    def __init__(self):
        self.inferobj = FreeAirAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf,hmap) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf, hmap);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.freeAirReply() 

        if res:
            inf_result = inferserver_pb2.FREEAIR_PRESENT
        else:
            inf_result = inferserver_pb2.FREEAIR_ABSENT

        return inferserver_pb2.freeAirReply(
            result = inf_result,
            confidenceScore = inf_conf * 100,
            heatmapPath = hmap
        )

class InfererCarina(inferserver_pb2_grpc.InferCarinaServicer):
    def __init__(self):
        self.inferobj = CarinaAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf,hmap) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf, hmap);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.carinaReply() 

        if res:
            inf_result = inferserver_pb2.CARINA_PRESENT
        else:
            inf_result = inferserver_pb2.CARINA_ABSENT

        return inferserver_pb2.carinaReply(
            result = inf_result,
            confidenceScore = inf_conf * 100,
            heatmapPath = hmap
        )

class InfererETTube(inferserver_pb2_grpc.InferETTubeServicer):
    def __init__(self):
        self.inferobj = ETTubeAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf,hmap) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf, hmap);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.ettubeReply() 

        if res:
            inf_result = inferserver_pb2.ETTUBE_PRESENT
        else:
            inf_result = inferserver_pb2.ETTUBE_ABSENT

        return inferserver_pb2.ettubeReply(
            result = inf_result,
            confidenceScore = inf_conf * 100,
            heatmapPath = hmap
        )

class InfererETTubeTip(inferserver_pb2_grpc.InferETTubeTipServicer):
    def __init__(self):
        self.inferobj = ETTubeTipAlgorithm()

    def inferDCM(self, request, context):
        print(request.dcmname)
        try:
            (res,inf_conf,hmap) = self.inferobj.inferDicomFile(request.dcmname)
            print(res,inf_conf, hmap);
        except InferenceException as ie:
            context.set_details(ie.value)
            context.set_code(grpc.StatusCode.INTERNAL)
            return inferserver_pb2.ettubeTipReply() 

        if res:
            inf_result = inferserver_pb2.ETTUBE_TIP_PRESENT
        else:
            inf_result = inferserver_pb2.ETTUBE_TIP_ABSENT

        return inferserver_pb2.ettubeTipReply(
            result = inf_result,
            confidenceScore = inf_conf * 100,
            heatmapPath = hmap
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    inferserver_pb2_grpc.add_InferChestFrontalServicer_to_server(InfererChestFrontal(), server)
    inferserver_pb2_grpc.add_InferRotationServicer_to_server(InfererRotation(), server)
    inferserver_pb2_grpc.add_InferLungFieldServicer_to_server(InfererLungField(), server)
    inferserver_pb2_grpc.add_InferPneumothoraxServicer_to_server(InfererPneumothorax(), server)
    inferserver_pb2_grpc.add_InferFreeAirServicer_to_server(InfererFreeAir(), server)
    inferserver_pb2_grpc.add_InferCarinaServicer_to_server(InfererCarina(), server)
    inferserver_pb2_grpc.add_InferETTubeServicer_to_server(InfererETTube(), server)
    inferserver_pb2_grpc.add_InferETTubeTipServicer_to_server(InfererETTubeTip(), server)

    server.add_insecure_port('[::]:50052')
    server.start()
    try:
        while True:
            time.sleep(60*60*24)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    serve()
