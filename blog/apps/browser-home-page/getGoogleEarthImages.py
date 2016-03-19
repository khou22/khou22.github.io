from bs4 import BeautifulSoup # Module to sort through the html
import lxml # Module to parse through the html for BeautifulSoup
import urllib2 # Gets html
import webbrowser # This module can control the browser
import time # Getting current time (float type)
import datetime # Formatting current time into a string
import sys # More control over printing

# print "Script to grab all working Google Earth images"
# Cycle through all the potential Google Earth URLs. Collect the good indexes and create a Javascript array for them.
# Can then use that file in my Javascript app
# Good practice for communicating between Javascript and Python
# Also good practice for web scraping with Python

indexRange = [0, 2200] # Approximate range of indexes
# indexRange = [2190, 2199] # Practice range (much shorter and faster to debug)
baseUrl = "https://www.gstatic.com/prettyearth/assets/full/"
goodImages = []

for i in range(indexRange[0], indexRange[1]):
    # print "Checking link: %d..." % i # Feedback
    finalUrl = baseUrl + str(i) + ".jpg" # Concatenate
    # print finalUrl

    try:
        urllib2.urlopen(finalUrl)
    except urllib2.HTTPError, e: # Check the errors
        if e.code == 404: # 404 error
            print "Index %d ---> 404: Page Not Found" % i
        else: # Other error
            print "Index %d ---> Error, but not 404" % i
    else: # Found the page
        print "Index %d ---> 200: Image Found" % i
        goodImages.append(i)
# print goodImages

# Get current time stamp
ts = time.time() # Get current time
timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') # Format current time
timestamp = str(timestamp)
# print timestamp # Feedback

# Create JS file
# '\n' signifies a line break
fileName = "GoodImages.js"
outputFile = open(fileName, 'w') # 'w' for writing, will overwrite existing
outputFile.write("console.log('Loaded Google Earth Image Indexes');\n") # Write debugger code
outputFile.write("var timestamp = '" + timestamp + "';\n") # Store as a variable so Javascript can access as variable
outputFile.write("console.log('Last updated:', timestamp);\n") # Add time stamp from current time
outputFile.write("var goodImages = [\n") # Open array
outputFile.write("  ") # Indent for formatting

for i in range(0, len(goodImages)): # Cycle through array
    count = i + 1
    percent = count * 1e2 /float(len(goodImages)) # Calculate percentage complete
    # print(percent)
    sys.stdout.write("\r%d%%" % percent)
    sys.stdout.flush() # No line break

    outputFile.write(str(goodImages[i])) # Add image index string to array
    if i != len(goodImages) - 1: # If not the last image index
        outputFile.write(",\n") # Continue array
        outputFile.write("  ") # Indent for formatting
    else: # Last element in array
        outputFile.write("\n];") # Close array

print "" # Line break
print "****** Retrieved %d Google Earth Image Indexes ******" % len(goodImages)
