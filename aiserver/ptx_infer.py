from seekernet import SeekerNetAlgorithm
from ai_common import InferenceException, PTX_MODEL_PATH
import sys

class PneumothoraxAlgorithm(SeekerNetAlgorithm):
    THRESHOLD = 0.72
    MODEL_PATH = PTX_MODEL_PATH

    def __init__(self):
        SeekerNetAlgorithm.__init__(self,"ptx",1,self.THRESHOLD, pbpath=self.MODEL_PATH) 

if __name__ == '__main__':
    ptx = PneumothoraxAlgorithm()
    print(ptx.inferDicomFile(sys.argv[1]))
