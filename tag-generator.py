import io # For file writing
from datetime import datetime # For timestamps
import os # Searching through computer directory

tags = [
    # iOS Development
    'Xcode',
    'Swift',
    'Ionic',

    # Web Development
    'Javascript',
    'NodeJS',
    'ReactJS',
    'Redux',
    'Database',
    'ES6',
    'CSS',
    'HTML',
    'AngularJS',
    'Express Server',

    # Other programming
    'Python',
    'Package Manager',
    'Java',
    'Processing',

    # Design
    'Design Process',
    'User Experience',
    'User Interface',
    'Graphic Design',

    # Developer Tools
    'Unix',
    'MacOS',
    'VIM',
    'Terminal',
    'GitHub',

    # General
    'Animations',
    'Backend Server',
    'Reflection',
    'Tutorial',
    'Source Code',
    'Internship',

    # Project-scale
    'Project',
    'Hackathon',
    
    # Woodshop
]

try:
    with io.FileIO('_data/tags.yml', 'w') as tagFile: # Writing file and creating file if it doesn't exist
        readableList = open('_data/allTags.txt', 'w') # Create a readable list

        tagFile.write("# Last updated: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + '\n') # Timestamp
        tagFile.write('\n') # Line break

        # Create entry for each tag
        for tag in tags:
            slug = '' # Store slug

            title = tag.title() # Capitalize first letter of each word
            if ' ' in title: # If multiple words
                upperCamelCase = "".join(title.split()) # Remove spaces
                lowerCamelCase = list(upperCamelCase)
                lowerCamelCase[0] = lowerCamelCase[0].lower() # Lowercase first letter
                slug = "".join(lowerCamelCase)
            else:
                slug = title.lower() # All lowercase

            tagFile.write(slug + ':' + '\n')
            tagFile.write('  slug: ' + slug + '\n')
            tagFile.write('  name: ' + tag + '\n')
            tagFile.write('\n') # Line break

            # Add to readable list
            readableList.write(tag.ljust(25) + slug + '\n') # Make table of contents with alignment

            # Write its .md file in the blog/tags folder
            with open('blog/tag/' + slug + '.md', 'w+') as tagPage: # Writing file and creating file if it doesn't exist
                tagPage.write('---\n') # Open
                tagPage.write('layout: blog_by_tag\n')
                tagPage.write('title: \'Articles by tag: ' + tag + '\'\n')
                tagPage.write('tag: ' + slug + '\n')
                tagPage.write('permalink: /blog/tag/' + slug + '\n')
                tagPage.write('---\n') # Close

                tagPage.close() # End

        tagFile.close()
        readableList.close()


 
except IOError as (errno, strerror):
    print "I/O error({0}): {1}".format(errno, strerror)
