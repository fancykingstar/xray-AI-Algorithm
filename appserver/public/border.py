from PIL import Image
import sys

old_im = Image.open(sys.argv[1])
old_size = old_im.size
print(old_size)

new_size = (old_size[0] + 200, old_size[1] + 200 )
new_im = Image.new("RGB", new_size)   ## luckily, this is already black!
new_im.paste(old_im, ((new_size[0]-old_size[0])//2,
                          (new_size[1]-old_size[1])//2))

new_im.show()
new_im.save('out.jpg')
