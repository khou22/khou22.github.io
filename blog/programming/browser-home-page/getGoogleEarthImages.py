from bs4 import BeautifulSoup # Module to sort through the html
import lxml # Module to parse through the html for BeautifulSoup
import urllib2 # Gets html
import webbrowser # This module can control the browser
import time # Getting current time (float type)
import datetime # Formatting current time into a string
import sys # More control over printing
# Image repository: https://earthview.withgoogle.com/

# print "Script to grab all working Google Earth images"
# Cycle through all the potential Google Earth URLs. Collect the good indexes and create a Javascript array for them.
# Can then use that file in my Javascript app
# Good practice for communicating between Javascript and Python - python writing javascript to be read by other javascript
# Also good practice for web scraping with Python, creating my own functions

indexRange = [1000, 3050] # Approximate range of indexes
# indexRange = [2197, 2199] # Practice range (much shorter and faster to debug)
baseUrl = "https://www.gstatic.com/prettyearth/assets/full/"
goodImages = []
badImageCount = 0

count = 0.0 # Index starting from 0
for i in range(indexRange[0], indexRange[1]):
    # print "Checking link: %d..." % i # Feedback
    finalUrl = baseUrl + str(i) + ".jpg" # Concatenate
    # print finalUrl

    count += 1.0 # Add to counter
    total = float(indexRange[1] - indexRange[0])

    # Progress bar: http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console
    # Author: Greenstick and Vladimir Ignatyev
    prefix = ''
    suffix = ''
    decimals = 3
    barLength = 100
    filledLength    = int(round(barLength * count / float(total)))
    percents        = round(100.00 * (count / float(total)), decimals)
    bar             = '#' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('%s [%s] %s%s %s\r' % (prefix, bar, percents, '%', suffix)),
    sys.stdout.flush()

    try:
        urllib2.urlopen(finalUrl)
    except urllib2.HTTPError, e: # Check the errors
        if e.code == 404: # 404 error
            # print "Index %d ---> 404: Page Not Found" % i # Feedback
            badImageCount += 1 # Add to counter
        else: # Other error
            # print "Index %d ---> Error, but not 404" % i # Feedback
            badImageCount += 1
    else: # Found the page
        # print "Index %d ---> 200: Image Found" % i # Feedback
        goodImages.append(i)
# print goodImages

# Get current time stamp
ts = time.time() # Get current time
timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') # Format current time
timestamp = str(timestamp)
# print timestamp # Feedback

# Create JS file
def createJavascriptVar(varName, value, varType): # Function for creating JS variable declaration
    # Allows Javascript to access values as variable
    # print "Creating variable: %s" % varName # Feedback
    output = "var " + varName + " = " # Add variable name and equals sign
    if varType is 'string': # If a string type
        # print "Type: String"
        output += "'" + value + "';\n"
    elif varType is 'int': # If a number and not a string
        # print "Type: Int"
        output += str(value) + ";\n" # Semicolon and new line
    # print output # Feedback
    return output # Return as a value

def createConsoleLog(message): # Function for creating JS console.log
    # Good for debugging/user feedback in JS file
    output = "console.log('" + message + "');\n" # Concatenate strings
    # print output # Feedback
    return output

# '\n' signifies a line break
fileName = "GoodGoogleEarthImages.js"
outputFile = open(fileName, 'w') # 'w' for writing, will overwrite existing

# Code to write more code
outputFile.write(createConsoleLog("Loaded Google Earth Image Indexes")) # Write debugger code
outputFile.write(createConsoleLog("Last updated: " + timestamp)) # Add time stamp from current time
outputFile.write(createJavascriptVar('timestamp', timestamp, 'string')) # Create JS variable for timestamp
outputFile.write(createJavascriptVar('goodImageCount', len(goodImages), 'int')) # Create JS variable for good image count
outputFile.write(createJavascriptVar('badImageCount', badImageCount, 'int')) # Create JS variable for bad image count
outputFile.write("var goodImages = [\n") # Open array
outputFile.write("  ") # Indent for formatting

for i in range(0, len(goodImages)): # Cycle through array
    count = i + 1
    percent = count * 1e2 /float(len(goodImages)) # Calculate percentage complete
    # print(percent)
    sys.stdout.write("\r%d%%" % percent)
    sys.stdout.flush() # No line break

    outputFile.write(str(goodImages[i])) # Add image index int to array
    if i != len(goodImages) - 1: # If not the last image index
        outputFile.write(",\n") # Continue array
        outputFile.write("  ") # Indent for formatting
    else: # Last element in array
        outputFile.write("\n];") # Close array

print "" # Line break
print "****** Retrieved %d Google Earth Image Indexes ******" % len(goodImages)
