# Kevin Hou's Personal Website and Blog
Programmed in HTML, SCSS (transpiled to CSS), Javascript (ES5), and Ruby. The blog is powered by Jekyll using Liquid Tags.  
Framework: ReactJS  
Satic Site Generator: Jekyll  

This is the Github repository I use to serve my Github Pages site. This is my main website that I use to centralize my pictures, projects, apps, etc. All my previous websites and social media accounts are linked from this site including my LinkedIn, YouTube, and Flickr. I am continuously updating content so stay tuned. I am currently in the process of redesigning and restructuring my blog.  

I started building this site in August 2015. I had been writing apps in Java and had done some minor web development before then, but I wanted to start an entire public website from scratch. It lets me not only continue my passion for coding, but also to pursue my interests in design, photography, woodshop, etc. I've developed fluency in Node, ES6, Webpack, Express servers, etc. which I use on my Heroku web app at [khou22.herokuapp.com](http://khou22.herokuapp.com/).  

If you have any comments, suggestions, or feedback please let me know via email or LinkedIn!

# Gems
Uses `bundle`. Installation: `gem install bundler`.

# Usage
Using shortcut:
`$ ./serve.sh`
Must first allow file to run commands by running: `chmod +x serve.sh`

# Tag Manager
The python script `tag-generator.py` contains an array of a list of all tags that I use. When run, it will create all neccessary files in the `_data/` and `blog/tags/` folders. To delete tags, remove all files except for `index.html` from `blog/tags/` and run `tag-generator.py`.
