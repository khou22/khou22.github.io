# Kevin Hou's Personal Website and Blog

[![built with Codeium](https://codeium.com/badges/main)](https://codeium.com?repo_name=khou22%2Fkhou22.github.io)

Programmed in HTML, SCSS (transpiled to CSS), Javascript (ES5), Python, and Ruby. The blog is powered by Jekyll using Liquid Tags.  
Framework: ReactJS  
Satic Site Generator: Jekyll  

This is the Github repository I use to serve my Github Pages site. This is my main website that I use to centralize my pictures, projects, apps, etc. All my previous websites and social media accounts are linked from this site including my LinkedIn, YouTube, and Flickr. I am continuously updating content so stay tuned. I am currently in the process of redesigning and restructuring my blog.  

I started building this site in August 2015 as a reason to build an entire public website from scratch. It let me not only grow my passion for coding, but also share my interests in design, photography, woodshop, etc.

If you have any comments, suggestions, or feedback please let me know via email or LinkedIn!

# Gems
Uses `bundle`. Installation: `gem install bundler`.

# Semantic UI
https://semantic-ui.com/introduction/getting-started.html
[Potential themes](https://semantic-ui-forest.com/themes/semantic-ui/v2/flat)

# Usage
Using shortcut:
`$ ./serve.sh`
Must first allow file to run commands by running: `chmod +x serve.sh`

# Tag Manager
The python script `tag-generator.py` contains an array of a list of all tags that I use. When run, it will create all neccessary files in the `_data/` and `blog/tags/` folders. To delete tags, remove all files except for `index.html` from `blog/tags/` and run `tag-generator.py`.

# Photography
My photography is powered by [Lookbook](https://getlookbook.com/), an AI-photo curation tool that I built, launched, and sold.
