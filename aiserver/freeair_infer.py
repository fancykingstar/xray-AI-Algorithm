from seekernet import SeekerNetAlgorithm
from ai_common import InferenceException, FREEAIR_MODEL_JSON, FREEAIR_MODEL_WEIGHTS
import sys

class FreeAirAlgorithm(SeekerNetAlgorithm):
    THRESHOLD = 0.5
    CHANNELS=3

    def __init__(self):
        SeekerNetAlgorithm.__init__(self,"freeair",self.CHANNELS,self.THRESHOLD, 
                json=FREEAIR_MODEL_JSON, weights=FREEAIR_MODEL_WEIGHTS) 

if __name__ == '__main__':
    fair = FreeAirAlgorithm()
    print(fair.inferDicomFile(sys.argv[1]))
