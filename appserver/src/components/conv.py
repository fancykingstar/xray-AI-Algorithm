import cv2
import sys

img=cv2.imread(sys.argv[1],0)

print("var ai_pixels = [\n");
for x in range(img.shape[0]):
    for y in range(img.shape[1]):
        print("{},".format(img[x,y]),end='')
        if( ( x* img.shape[1] + y ) % 32 == 0 ):
            print("");
print("];\n");
