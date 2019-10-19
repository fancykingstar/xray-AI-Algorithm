import numpy as np
from datetime import datetime
import os
from os import path 
import sys
import cv2

import dcm
import predictor
from lf_tf_common_proc import img_resize, gen_heatmap
from ai_common import InferenceException, postprocess_mask, EXPRESS_SERVER_HEATMAP_PATH


class SeekerNetAlgorithm:
    HEIGHT = 1024
    WIDTH = 1024

    def apply_calibration(self, prob_array):
        multiplier = self.A
        intercept = self.B
        tiny = 1e-20
        z = -np.log(np.maximum((1.0 - prob_array) / np.maximum(prob_array, tiny), tiny))
        z_prime = multiplier * z + intercept
        y_prime = 1.0 / (1.0 + np.exp(-z_prime))
        return y_prime

    def pre_process(self,img):
        img = img_resize(img, (self.HEIGHT, self.WIDTH),method="fit")
        img_min = img.min()
        img_max = img.max()
        img = (img.astype(np.float32) - img_min ) / (img_max - img_min)
        img = np.expand_dims(img,axis=0)
        img = np.expand_dims(img,axis=-1)
        if self.NUM_CHANNELS > 1:
            img = np.repeat(img, self.NUM_CHANNELS, -1)
        return img

    def __init__(self, name, num_channels, threshold, pbpath=None, json=None, weights=None, cmap_name="jet", alpha=0.25, A=1, B=0):
        self.name = name
        self.hmap_name=self.name+"_heatmap.png"
        self.NUM_CHANNELS = num_channels
        self.THRESHOLD=threshold
        self.alpha=alpha
        self.cmap_name=cmap_name
        #Calibration parameters
        self.A=A                  
        self.B=B

        print("Loading Model: {} ...".format(self.name))
        if pbpath != None:
            self.local_predictor = predictor.get_predictor_function(pbpath)
        elif json != None :
            self.local_predictor = predictor.get_predictor_function(json,weights)
        else:
            print("Error: You must pass one of saved model path or keras json + weights")
            sys.exit(0)

        dummy = np.random.rand(self.WIDTH,self.HEIGHT, self.NUM_CHANNELS)
        dummy = np.expand_dims(dummy,axis=0)
        for _ in range(2):
           self.local_predictor(dummy)

    def inferDicomFile(self,dcmfile):
        try:
            print("Inferencing {} for {}".format(self.name,dcmfile),flush=True)
            start_t = datetime.now()
            data = dcm.readDICOMImage(dcmfile, True)
        except Exception as e:
            try:
                data = cv2.imread(dcmfile,0)
            except Exception as e:
                print(e)
                raise InferenceException("Input File Read Error")
                return
        (horig,worig) = data.shape
        print("worig: {}, horig: {}".format(worig,horig))

        data = self.pre_process(data)
        conf, mask  = self.local_predictor(data)
        end_t = datetime.now()
        print("Execution Time for {} Algorithm: {}ms".format(self.name, (end_t-start_t).total_seconds() * 1000))

        mask = np.squeeze(mask)
        print("mask shape:{}".format(mask.shape))
        inp_image = np.squeeze(data)
        mask = postprocess_mask(mask, inp_image.shape, inp_image.shape)

        hmap_path = path.join(EXPRESS_SERVER_HEATMAP_PATH, self.hmap_name) 
        os.environ["HEATMAP_ALPHA"]=str(self.alpha)
        if self.NUM_CHANNELS > 1:
            I = gen_heatmap(np.squeeze(inp_image[:,:,0]), mask, out_fname=None, cmap_name=self.cmap_name) 
        else:
            I = gen_heatmap(inp_image, mask, out_fname=None, cmap_name=self.cmap_name) 
        os.environ["HEATMAP_ALPHA"]="0.25"

        X = np.empty((horig,worig,3),dtype=np.uint8)
        X[:,:,0] = img_resize(np.squeeze(I[:,:,0]), (horig,worig), method="crop")
        X[:,:,1] = img_resize(np.squeeze(I[:,:,1]), (horig,worig), method="crop")
        X[:,:,2] = img_resize(np.squeeze(I[:,:,2]), (horig,worig), method="crop")
        cv2.imwrite(hmap_path, X)

        cal_prob = self.apply_calibration(np.array([conf]))[0]

        if cal_prob >= self.THRESHOLD:
            result = True
        else:
            result = False
        return(result,cal_prob,self.hmap_name)
