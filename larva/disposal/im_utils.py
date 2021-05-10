import numpy as np
from PIL import Image, ExifTags


# 종횡비 유지하면서 정사각형 사진으로 변경
def make_square(im, min_size=128, fill_color=(0, 0, 0)):
    x, y = im.size
    size = max(min_size, x, y)
    new_im = Image.new('RGB', (size, size), fill_color)
    new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
    return new_im

# 각도 확인후 원래 상태로 돌리기
def check_angle(img):    
    try:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation]=='Orientation':
                break   

        exif = img._getexif()

        if exif[orientation] == 3:
            img=img.rotate(180, expand=True)
        elif exif[orientation] == 6:
            img=img.rotate(270, expand=True)
        elif exif[orientation] == 8:
            img=img.rotate(90, expand=True)

    except (AttributeError, KeyError, IndexError, TypeError):
        # cases: image don't have getexif
        pass
    return img

#  이미지 shape 변경
def resize_img(img, shape=(100,100)):
    img = img.resize(shape)
    return img
