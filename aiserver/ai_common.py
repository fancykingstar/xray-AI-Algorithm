import cv2
import numpy as np
from lf_tf_common_proc import img_resize
import yaml
import sys

MASK_SMOOTHING_KERNEL_SIZE=7

with open('./config.yml','r') as Y:
    cfg = yaml.load(Y)
    EXPRESS_SERVER_HEATMAP_PATH=cfg['heatmap_path']
    CF_MODEL_PATH=cfg['modelpaths']['cf_model_path']
    LF_MODEL_PATH=cfg['modelpaths']['lf_model_path']
    ROT_MODEL_PATH=cfg['modelpaths']['rot_model_path']
    PTX_MODEL_PATH=cfg['modelpaths']['ptx_model_path']
    FREEAIR_MODEL_JSON=cfg['modelpaths']['freeair_model_json']
    FREEAIR_MODEL_WEIGHTS=cfg['modelpaths']['freeair_model_weights']
    CARINA_MODEL_JSON=cfg['modelpaths']['carina_model_json']
    CARINA_MODEL_WEIGHTS=cfg['modelpaths']['carina_model_weights']
    ETTUBE_MODEL_JSON=cfg['modelpaths']['ettube_model_json']
    ETTUBE_MODEL_WEIGHTS=cfg['modelpaths']['ettube_model_weights']
    ETTUBETIP_MODEL_JSON=cfg['modelpaths']['ettubetip_model_json']
    ETTUBETIP_MODEL_WEIGHTS=cfg['modelpaths']['ettubetip_model_weights']

sys.path.append("/usr/local/lib")

class InferenceException(Exception):
    def __init__(self,value):
        self.value = value
    
    def __str__(self):
        return repr(self.value)

def postprocess_mask(mask, mask_size, input_img_size):
    """Applies post-processing on the mask output: Gaussian blur, resize, and thresholding

    Arguments:
        mask            (float32 numpy array): the local probability of ptx, predicted by the algorithm
        mask_size       (tuple): the shape of the mask that should be returned
        input_img_size  (tuple): the shape of the original input image

    Returns:
        (float32 numpy array): the processed probability mask
    """
    if mask.min() < 0 or mask.max() > 1:
        raise Exception("Invalid mask range: [{:f}, {:f}], it is expected to "
                        "be between 0.0 and 1.0".format(mask.min(), mask.max()))
    mask_max = mask.max()
    proc_mask = cv2.GaussianBlur(mask, (MASK_SMOOTHING_KERNEL_SIZE, MASK_SMOOTHING_KERNEL_SIZE), 0)
    #input image size must be (w,h)
    proc_mask = img_resize(proc_mask, input_img_size[:2], "crop")
    if not np.all(input_img_size == mask_size):
        proc_mask = img_resize(proc_mask, mask_size, "fit")
    proc_mask = proc_mask * (mask_max / proc_mask.max())
    proc_mask = (proc_mask > 0.5).astype(np.float32)*255
    print("mask area: {}".format(np.count_nonzero(proc_mask)))
    return proc_mask
