from seekernet import SeekerNetAlgorithm
from ai_common import InferenceException, CARINA_MODEL_JSON, CARINA_MODEL_WEIGHTS
import sys

class CarinaAlgorithm(SeekerNetAlgorithm):
    THRESHOLD = 0.5
    CHANNELS=3

    def __init__(self):
        SeekerNetAlgorithm.__init__(self,"carina",self.CHANNELS,self.THRESHOLD, 
                json=CARINA_MODEL_JSON, weights=CARINA_MODEL_WEIGHTS, cmap_name="hsv", alpha=0.8) 

if __name__ == '__main__':
    carina = CarinaAlgorithm()
    print(carina.inferDicomFile(sys.argv[1]))
