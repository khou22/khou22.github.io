# Get files from khou22.github.io/media/store/

import glob
import calendar
import time
import io
from datetime import datetime

# Options
outputFileName = "storeImages.js"

imageList = glob.glob('../../media/store/*')

print("%d new image(s) found" % len(imageList))

################   Output to JS File   ################
print("Writing to file " + outputFileName)
try:
    with io.FileIO(outputFileName, 'w') as outputFile: # Writing file and creating file if it doesn't exist
        outputFile.write("// Last updated: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n") # Timestamp
        outputFile.write("const storeImages = [\n") # Open array

        # Cycle through data
        for image in imageList:
            outputFile.write("  \"%s\",\n" % image)

        outputFile.write("];") # Close array
        outputFile.close()
except IOError as (errno, strerror):
    print "I/O error({0}): {1}".format(errno, strerror)

