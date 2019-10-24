import numpy as np
from datetime import datetime
import tensorflow as tf
from tensorflow.python.saved_model.signature_constants import PREDICT_INPUTS
from lf_tf_common_proc import img_resize
from ai_common import InferenceException, CF_MODEL_PATH
import dcm
import sys
import cv2


class ChestFrontalAlgorithm:
    HEIGHT = 128
    WIDTH = 128
    DEPTH = 1
    THRESHOLD = 0.5
    MODEL_PATH=CF_MODEL_PATH

    def pre_process(self,img):
        img = img_resize(img, (self.HEIGHT, self.WIDTH))
        img = img / (np.max(img) + 1e-8)
        img = np.expand_dims(img,axis=0)
        img = np.expand_dims(img,axis=-1)
        return img

    def __init__(self):
        print("Loading Model: {}...".format('CHEST FRONTAL'))
        self.spmodel = tf.contrib.predictor.from_saved_model(self.MODEL_PATH)
        dummy = np.random.rand(self.WIDTH,self.HEIGHT)
        dummy = np.expand_dims(dummy,axis=0)
        dummy = np.expand_dims(dummy,axis=-1)
        for _ in range(2):
           self.spmodel({PREDICT_INPUTS:dummy})

    def inferDicomFile(self,dcmfile):
        try:
            # print("Inferencing Chest Frontal {}: ".format(dcmfile),flush=True)
            start_t = datetime.now()
            data = dcm.readDICOMImage(dcmfile, True)
        except Exception as e:
            print("Nota Dicom file!  trying jpg")
            try:
                data = cv2.imread(dcmfile,0)
            except Exception as e:
                print(e)
                raise InferenceException("DICOM Read Error")
                return

        data = self.pre_process(data)
        rs = self.spmodel({PREDICT_INPUTS:data})
        conf = rs['dense_6'][0][0]
        if conf >= self.THRESHOLD:
            result = True
        else:
            result = False
        end_t = datetime.now()
        print("Execution Time for Chest Frontal: {}ms".format((end_t-start_t).total_seconds() * 1000))
        return (result, conf)

if __name__ == '__main__':
    cf = ChestFrontalAlgorithm()
    print(cf.inferDicomFile(sys.argv[1]))
