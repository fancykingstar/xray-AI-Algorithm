from __future__ import print_function

import grpc
import sys

import inferserver_pb2
import inferserver_pb2_grpc

def run():

    with grpc.insecure_channel('localhost:50051') as channel:
        stub = inferserver_pb2_grpc.InferChestFrontalStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{}".format(inferserver_pb2.ChestFrontalResult.Name(response.result), response.confidenceScore) );

        stub = inferserver_pb2_grpc.InferRotationStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{}".format(inferserver_pb2.RotationResult.Name(response.result), response.confidenceScore) );

        stub = inferserver_pb2_grpc.InferLungFieldStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{}".format(inferserver_pb2.LungFieldResult.Name(response.result), response.confidenceScore) );

        stub = inferserver_pb2_grpc.InferPneumothoraxStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{} \n heatmapPath: {}".format(inferserver_pb2.PneumothoraxResult.Name(response.result), response.confidenceScore, response.heatmapPath) );

        stub = inferserver_pb2_grpc.InferFreeAirStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{} \n heatmapPath: {}".format(inferserver_pb2.FreeAirResult.Name(response.result), response.confidenceScore, response.heatmapPath) );

        stub = inferserver_pb2_grpc.InferCarinaStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{} \n heatmapPath: {}".format(inferserver_pb2.CarinaResult.Name(response.result), response.confidenceScore, response.heatmapPath) );

        stub = inferserver_pb2_grpc.InferETTubeStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{} \n heatmapPath: {}".format(inferserver_pb2.ETTubeResult.Name(response.result), response.confidenceScore, response.heatmapPath) );

        stub = inferserver_pb2_grpc.InferETTubeTipStub(channel)
        response = stub.inferDCM(inferserver_pb2.dcmRequest(dcmname=sys.argv[1]))
        print("Infer client received: Result :{} \n Confidence Score:{} \n heatmapPath: {}".format(inferserver_pb2.ETTubeTipResult.Name(response.result), response.confidenceScore, response.heatmapPath) );

if __name__ == '__main__':
    run()
