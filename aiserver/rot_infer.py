import numpy as np
import tensorflow as tf
from datetime import datetime
from tensorflow.python.saved_model.signature_constants import PREDICT_INPUTS
from lf_tf_common_proc import img_resize
from ai_common import InferenceException, ROT_MODEL_PATH
import dcm
import sys
import cv2


class RotationAlgorithm:
    HEIGHT = 256
    WIDTH = 256
    MODEL_PATH=ROT_MODEL_PATH

    def pre_process(self,img):
        img = img_resize(img, (self.HEIGHT, self.WIDTH))
        img = (img - np.min(img))/(np.max(img)-np.min(img)) *255.0
        img = img.astype(np.uint8)
        img = cv2.equalizeHist(img)
        img = img.astype(np.float32)/img.max()
        img = np.expand_dims(img,axis=0)
        img = np.expand_dims(img,axis=-1)
        return img

    def __init__(self):
        print("Loading Model: {}...".format('ROTATION'))
        self.spmodel = tf.contrib.predictor.from_saved_model(self.MODEL_PATH)
        dummy = np.random.rand(self.WIDTH,self.HEIGHT)
        dummy = np.expand_dims(dummy,axis=0)
        dummy = np.expand_dims(dummy,axis=-1)
        for _ in range(2):
           self.spmodel({PREDICT_INPUTS:dummy})

    def inferDicomFile(self,dcmfile):
        try:
            print("Inferencing Rotation {}".format(dcmfile),flush=True)
            start_t = datetime.now()
            data = dcm.readDICOMImage(dcmfile, True,True)
        except Exception as e:
            try:
                data = cv2.imread(dcmfile,0)
            except Exception as e:
                print(e)
                raise InferenceException("DICOM Read Error")
                return

        data = self.pre_process(data)
        rs = self.spmodel({PREDICT_INPUTS:data})
        conflist = rs['Output'][0]
        print(conflist)
        result = np.argmax(conflist)
        conf = conflist[result]
        end_t = datetime.now()
        print("Execution Time for Rotation: {}ms".format((end_t-start_t).total_seconds() * 1000))
        return (result, conf)

if __name__ == '__main__':
    rot = RotationAlgorithm()
    print(rot.inferDicomFile(sys.argv[1]))
