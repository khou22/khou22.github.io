from bs4 import BeautifulSoup # Module to sort through the html
import lxml # Module to parse through the html for BeautifulSoup
import urllib2 # Gets html
import webbrowser # This module can control the browser
import time # Getting current time (float type)
import datetime # Formatting current time into a string
import sys # More control over printing
# Image repository: https://earthview.withgoogle.com/

# Doesn't work right now — might be worth scratching this project because the Bing wallpaper is only changed once a day

# print "Script to grab a certain number of Bing backgrounds"
# Cycle through all the potential Bing backgrounds. Collect the good indexes and create a Javascript array for them.
# Can then use that file in my Javascript app
# Good practice for communicating between Javascript and Python - python writing javascript to be read by other javascript
# Also good practice for web scraping with Python, creating my own functions

numberOfImages = 1
wallpapers = []

for i in range(0, numberOfImages):

    count = float(i)
    total = float(numberOfImages)

    # Progress bar: http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console
    # Author: Greenstick and Vladimir Ignatyev
    prefix = ''
    suffix = ''
    decimals = 3
    barLength = 100
    filledLength = int(round(barLength * count / float(total)))
    percents = round(100.00 * (count / float(total)), decimals)
    bar = '#' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('%s [%s] %s%s %s\r' % (prefix, bar, percents, '%', suffix)),
    sys.stdout.flush()

    response = urllib2.urlopen("http://www.bing.com/") #Get markdown
    html = response.read() #Markdown
    soup = BeautifulSoup(html, "lxml") # Using lxml parser
    markdown = str(soup.body)
    print markdown

    start = "g_img={url:'" # Start of URL
    end = "',id:'bgDiv'" # End of URL
    startIndex = markdown.index(start) + len(start) # Crop to the beginning of the URL, trim the start indicator
    endIndex = markdown.index(end) # Crop to the end of the URL
    backgroundURL = markdown[startIndex:endIndex] # Trim the string to the indexes
    print backgroundURL # Feedback

    wallpapers.append(backgroundURL)


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
fileName = "BingWallpapers.js"
outputFile = open(fileName, 'w') # 'w' for writing, will overwrite existing

# Code to write more code
outputFile.write(createConsoleLog("Loaded Bing Wallpapers")) # Write debugger code
outputFile.write(createConsoleLog("Last updated: " + timestamp)) # Add time stamp from current time
outputFile.write(createJavascriptVar('timestamp', timestamp, 'string')) # Create JS variable for timestamp
outputFile.write("var BingWallpapers = [\n") # Open array
outputFile.write("  ") # Indent for formatting

for i in range(0, len(wallpapers)): # Cycle through array
    count = i + 1
    percent = count * 1e2 /float(len(wallpapers)) # Calculate percentage complete
    # print(percent)
    sys.stdout.write("\r%d%%" % percent)
    sys.stdout.flush() # No line break

    outputFile.write("\"" + str(wallpapers[i]) + "\"") # Add image index string to array
    if i != len(wallpapers) - 1: # If not the last image index
        outputFile.write(",\n") # Continue array
        outputFile.write("  ") # Indent for formatting
    else: # Last element in array
        outputFile.write("\n];") # Close array

print "" # Line break
print "****** Retrieved %d Bing Wallpaper URL's ******" % len(wallpapers)
