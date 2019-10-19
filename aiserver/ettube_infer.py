from seekernet import SeekerNetAlgorithm
from ai_common import InferenceException, ETTUBE_MODEL_JSON, ETTUBE_MODEL_WEIGHTS
import sys

class ETTubeAlgorithm(SeekerNetAlgorithm):
    THRESHOLD = 0.5
    CHANNELS=3

    def __init__(self):
        SeekerNetAlgorithm.__init__(self,"ettube",self.CHANNELS,self.THRESHOLD, 
                json=ETTUBE_MODEL_JSON, weights=ETTUBE_MODEL_WEIGHTS, cmap_name="copper", alpha=0.4) 

if __name__ == '__main__':
    ett = ETTubeAlgorithm()
    print(ett.inferDicomFile(sys.argv[1]))
