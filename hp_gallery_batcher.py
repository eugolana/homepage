import os, sys
import Image

source_path = './assets/images/'
dest_path = './assets/images/thumbs/'
clear_dest = False
md_bool = True
md_dir = './_gallery/'


thumbnail_size = 640


def resizeImageSquare(fn, size, o, override=False):
    if not override and o.split('/')[-1] in os.listdir("/".join(o.split('/')[:-1])):
        print "%s already exists" % o
        return
    i = Image.open(fn)
    if i.width <= i.height:
        new_width = size
        ratio = float(size) / i.width
        new_height = int(i.height * ratio)
    else:
        new_height = size
        ratio = float(size) / i.height
        new_width = int(ratio * i.width)
    i2 = i.resize((new_width, new_height)).crop((0,0,size, size))
    print i2
    i2.save(o)
    return

def make_md(fn, o, override = False):
    if not override and o.split('/')[-1] in os.listdir("/".join(o.split('/')[:-1])):
        print "%s already exists" % o
        return
    text = """---
layout: gallery
title: %s
image: %s
thumb: thumbs/%s
description:
---
    """ %(fn.split('.')[0].replace('_', ' '), fn, fn.split('.')[0] + '_thumb.jpg')
    f = open(o, 'w')
    f.write(text)
    f.close()



if __name__ == "__main__":
    if clear_dest:
        # clear any images in the thumb directory
        for f in os.listdir(dest_path):
            os.remove(dest_path + f)
    for f in os.listdir(source_path):
        try:
            fn, ext = f.split('.')
        except ValueError:
            fn, ext = "i am", "a directory"
        if ext in ['jpg', 'jpeg', 'png'] and not fn.split('_')[-1] in ['thumb']:
            new_fn = f.split('.')[0] + '_thumb' + '.jpg'
            resizeImageSquare(source_path + f, thumbnail_size, dest_path + new_fn)
            if md_bool:
                make_md(f, "%s%s.md" % (md_dir,  fn))
