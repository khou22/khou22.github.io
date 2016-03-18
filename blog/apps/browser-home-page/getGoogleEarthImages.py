from bs4 import BeautifulSoup # Module to sort through the html
import lxml # Module to parse through the html for BeautifulSoup
import urllib2 # Gets html
import webbrowser # This module can control the browser

# print "Script to grab all working Google Earth images"
# Cycle through all the potential URLs. Collect the good indexes and create a Javascript array for them.
# Can then use that file in my Javascript app

fileName = "GoodImages.js"
outputFile = open(fileName, 'w') # 'w' for writing, will overwrite existing
outputFile.write("var goodImages = [")

# indexRange = [0, 2199]
indexRange = [2196, 2199]
baseUrl = "https://www.gstatic.com/prettyearth/assets/full/"
# goodImages = []

for i in range(indexRange[0], indexRange[1]):
    print "Checking link: %d..." % i
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
        # goodImages.append(i)
        temp = str(i) + ", "
        outputFile.write(temp)
# print goodImages
