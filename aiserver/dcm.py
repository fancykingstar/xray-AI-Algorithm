import pydicom as dicom
import numpy as np
import argparse
import struct
import cv2

def rebin(a, shape):
    sh = shape[0],a.shape[0]//shape[0],shape[1],a.shape[1]//shape[1]
    return a.reshape(sh).mean(-1).mean(1)

def applyClahe(img):
    clahe = cv2.createCLAHE()
    cl1 = clahe.apply(img)
    return cl1

def readDICOMImage(dcm_in, apply_ww=True, debug=False):
    try:
        pdcmImage = dicom.read_file(dcm_in)
    except RuntimeError as rerr:
        print("Runtime Error for reading DICOM image: {}:{}".format(rerr.errono,rerr.strerror))
        raise

    pixarr = pdcmImage.pixel_array
    if pdcmImage[0x28,0x0004].value == "MONOCHROME1":
         if debug:
            print("Monochrome image. Invert and Send!!")
         pixarr = pixarr.max() - pixarr
         apply_ww = False


    if not apply_ww:
        return pixarr

    if dicom.tag.Tag(0x28,0x3010) in pdcmImage.keys():
        apply_voilut = True
    else:
        apply_voilut = False

    if apply_voilut:
        if debug:
            print("Applying Normal VOI LUT")
        voilutnormal=pdcmImage[0x28,0x3010][0]
        lutvalues=voilutnormal[0x28,0x3006].value
        if isinstance(lutvalues,bytes):
            lut=[]
            for i in range(int(len(lutvalues)/2)):
                lut.append(struct.unpack('<H',lutvalues[i*2:(i+1)*2]))
            ln = len(lut)
            lut.append(lut[ln-2])
            lut.append(lut[ln-1])
            lut=np.array(lut)
        else:
            lut=np.array(voilutnormal[0x28,0x3006].value).astype(np.uint16)
            lut = np.append(lut,[lut[len(lut)-1]])
        maxlutin=2**voilutnormal[0x28,0x3002][2]-1
        single = np.take(lut,pixarr).astype(np.uint16)
    else:
        if dicom.tag.Tag(0x28,0x1050) in pdcmImage.keys():
            if isinstance(pdcmImage[0x28,0x1050].value,dicom.multival.MultiValue):
                if debug:
                    print("Applying WW/WL Normal from Multivalue")
                wc = int(pdcmImage[0x28,0x1050][0])
                ww = int(pdcmImage[0x28,0x1051][0])
            else:
                if debug:
                    print("Applying WW/WL Single value")
                wc = int(pdcmImage[0x28,0x1050].value)
                ww = int(pdcmImage[0x28,0x1051].value)
        else:
            #return np.expand_dims(pixarr,axis=-1)
            return pixarr

        pixmin = pixarr.min()
        pixmax = pixarr.max()
        winmin = int( wc - np.floor(ww/2) )
        winmax = int( wc + np.ceil(ww/2) )
        if pixmin + 1 >= winmin: 
            consolidated_min = pixmin
        else:
            consolidated_min = winmin

        if pixmax - 1 <= winmax:
            consolidated_max = pixmax
        else:
            consolidated_max = winmax
        single = np.clip(pixarr, consolidated_min, consolidated_max) - consolidated_min

    #single=np.expand_dims(single, axis=-1)
    return single
    #single = applyClahe(single)
    #img = np.stack([single for _ in range(3)],axis=-1)
    #return img

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('dcm_in',help="Input Dicom Image",type=str)
    args = parser.parse_args()
    if args.dcm_in:
        readDICOMImage(args.dcm_in, debug=True)
