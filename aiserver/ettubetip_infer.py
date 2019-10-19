from seekernet import SeekerNetAlgorithm
from ai_common import InferenceException, ETTUBETIP_MODEL_JSON, ETTUBETIP_MODEL_WEIGHTS 
import sys

class ETTubeTipAlgorithm(SeekerNetAlgorithm):
    THRESHOLD = 0.5
    CHANNELS=3

    def __init__(self):
        SeekerNetAlgorithm.__init__(self,"ettubetip",self.CHANNELS,self.THRESHOLD, 
                json=ETTUBETIP_MODEL_JSON, weights=ETTUBETIP_MODEL_WEIGHTS, cmap_name="brg", alpha=0.4) 

if __name__ == '__main__':
    etttip = ETTubeTipAlgorithm()
    print(etttip.inferDicomFile(sys.argv[1]))
