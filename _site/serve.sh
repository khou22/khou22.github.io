# Building and serving locally

# Open localhost site
# /usr/bin/open -a "/Applications/Google Chrome.app" http://localhost:4000/

# Start build/local server — must be at end of script
# Options:
# --future allows you to see blog posts dated in the future
# --livereload turns on live reloading
# --incremental turns on incremental builds for faster build times
# bundle exec jekyll serve --watch --future --livereload --incremental
bundle exec jekyll serve --watch --future --incremental
