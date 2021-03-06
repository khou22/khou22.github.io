# An image manager for a local cache of small images
# Can check whether the image exists already before creating

import glob
import os
from io import BytesIO

import requests
from PIL import Image


'''
Pinned to bottom right corner
'''
def watermark_with_transparency(base_image: Image,
                                watermark: Image,
                                size: float, offset: float) -> Image:
    width, height = base_image.size
    watermark_width, watermark_height = watermark.size

    # Configure watermark positioning based on base image
    watermarkFinalWidth = int(round(size * width))
    watermarkFinalHeight = int(
        round((watermarkFinalWidth / watermark_width) * watermark_height))
    watermarkX = width - watermarkFinalWidth - int(round(offset * width))
    watermarkY = height - watermarkFinalHeight - int(round(offset * height))

    watermark_resized = watermark.resize(
        (watermarkFinalWidth, watermarkFinalHeight), resample=Image.NEAREST)
    watermark_box = (watermarkX, watermarkY, watermarkX +
                     watermarkFinalWidth, watermarkY + watermarkFinalHeight)

    print("Width: %d  |  Height: %d" %
          (watermarkFinalWidth, watermarkFinalHeight))

    transparent = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    transparent.paste(base_image, (0, 0))
    transparent.paste(watermark_resized, watermark_box, mask=watermark_resized)
    transparent = transparent.convert("RGB")
    return transparent

class ImageManager:

    def __init__(self, directory):
        if not os.path.exists(directory):
            os.makedirs(directory)

        self.directory = directory

        self.images = {}
        self.placeholderImages = {}
        self.allFileNames = []
        imageList = glob.glob('%s/*.jpg' % directory) # TODO: only jpeg images right now
        imagePlaceholderList = glob.glob('%s/*placeholder.jpg' % directory)

        for imagePlaceholder in imagePlaceholderList:
            if imagePlaceholder in imageList:
                imageList.remove(imagePlaceholder) # Prevent duplicates
            fileName = self.fileNameWithoutExt(imagePlaceholder)
            self.placeholderImages[fileName] = imagePlaceholder
            # print("Found placeholder %s" % fileName)

        for imagePath in imageList:
            fileName = os.path.basename(imagePath)
            self.images[fileName] = imagePath
            self.allFileNames.append(fileName)
    
    def getAllNames(self):
        return self.allFileNames;
    
    def fileNameWithoutExt(self, fileName):
        splitFileName = os.path.splitext(os.path.basename(fileName))
        if 'Angelo' in fileName:
            print(fileName)
            print(splitFileName)

        return splitFileName[0]
    
    def fileNamePlaceholder(self, fileName):
        return "%s.placeholder.jpg" % self.fileNameWithoutExt(fileName)

    def exists(self, image):
        imageExists = image in self.images.keys()
        placeholderImageName = self.fileNameWithoutExt(self.fileNamePlaceholder(image))
        placeholderImageExists = placeholderImageName in self.placeholderImages.keys()
        return imageExists and placeholderImageExists

    def getSrc(self, image):
        filePath = self.images[image]
        placeholderFileName = self.fileNamePlaceholder(filePath)
        img = Image.open(filePath)
        return filePath, placeholderFileName, img.width, img.height
    
    # Download the file into the image store using the imageName
    def create(self, imageName, src, resizeWidth, placeholderWidth):
        imageFileName = self.fileNameWithoutExt(imageName)

        imagePath = "%s/%s.jpg" % (self.directory, imageFileName)
        imagePlaceholderPath = "%s/%s.placeholder.jpg" % (self.directory, imageFileName)

        # Download image
        print("Downloading source: %s" % src)
        response = requests.get(src)
        img = Image.open(BytesIO(response.content))

        ## Large Image
        # Resize to width
        width = resizeWidth
        widthPercent = (width/float(img.size[0]))
        height = int(float(img.size[1]) * float(widthPercent))

        if width > height: # If landscape
            height = width
            heightPercentage = height/float(img.size[1])
            width = int(float(img.size[0] * float(heightPercentage)))

        # Apply resize
        imgResize = img.resize((width, height), Image.ANTIALIAS)

        # Watermark the image
        watermark = Image.open('watermark.png')
        imgResize = watermark_with_transparency(imgResize, watermark, size=0.13, offset=0.01)

        # Save the resized image
        imgResize.save(imagePath, 'JPEG', quality=100)

        # Placeholder image
        widthPlaceholder = placeholderWidth
        widthPercentPlaceholder = (placeholderWidth/float(imgResize.size[0]))
        heightPlaceholder = int(float(imgResize.size[1]) * float(widthPercentPlaceholder))
        if widthPlaceholder > heightPlaceholder: # If landscape
            heightPlaceholder = widthPlaceholder
            heightPlaceholderPercentage = heightPlaceholder/float(img.size[1])
            widthPlaceholder = int(float(img.size[0] * float(heightPlaceholderPercentage)))

        imgResize = imgResize.resize((widthPlaceholder, heightPlaceholder), Image.ANTIALIAS)
        imgResize.save(imagePlaceholderPath, 'JPEG', quality=90)


        # Save local mapping
        self.images[imageName] = imagePath
        self.placeholderImages[self.fileNameWithoutExt(imagePlaceholderPath)] = imagePlaceholderPath

        # On success, retrun the local path
        return imagePath, imagePlaceholderPath, width, height
