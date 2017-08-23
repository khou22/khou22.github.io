# Building and serving locally

# Open localhost site
# /usr/bin/open -a "/Applications/Google Chrome.app" http://localhost:4000/

# Start build/local server — must be at end of script
# Options:
# --future allows you to see blog posts dated in the future
# --livereload turns on live reloading# --host=0.0.0.0 makes it available over local networks to other machiens pointing at this machine's private IP address
bundle exec jekyll serve --watch --future --livereload --host=0.0.0.0

