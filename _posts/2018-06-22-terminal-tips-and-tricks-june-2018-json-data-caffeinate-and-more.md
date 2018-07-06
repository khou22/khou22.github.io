---
layout: post
title: "Terminal Tips and Tricks June 2018: JSON Data, Caffeinate, and More"
author: "Kevin Hou"
date: 2018-06-22 13:43:42
description: "A collection of helpful command line tips and tricks that I've collected over the past couple of months."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: configuration
tags: [terminal]
featured: "no"
---

# Inspecting JSON Data
Instead of spending time writing code to view JSON or using a JSON viewer app, which can both be incredibely slow with large JSON files, you can use `NodeJS` to inspect JSON objects. Simply start the Node console:

``` bash
$ node
```

Next, you can import the JSON and navigate the tree object to your heart's content.

``` javascript
>> // Import JSON
>> require('./path/to/json')
>> 
>> /* `_` references the last output
>>  *   In this case: _ = require(...)
>>  */
>> r = _
>> 
>> // Traverse JSON tree
>> r.data
```

# Prevent Mac from Sleeping
Mac's contain a built in terminal function called `Caffeinate`. While one could download the free ["Caffeine" app](http://lightheadsw.com/caffeine/) from the Mac App Store, the command line provides an easy alternative. It offers more control and in my opinion is easier to interpret. To activate, simply type:
``` bash
$ caffeinate # Indefinite amount of time
```

#### Options:
``` bash
-d	# Prevent display from sleeping
-i	# Prevent system from idle sleeping
-s	# Prevent system from lseeping (only when plugged in)
-u	# Resets the system timeout and/or will wake the computer
-t <seconds> # Specifies timeout in seconds from the time the command is run
```

# SSH Tricks

### SSH Shortcut
Modify your `~/.ssh/config` file and add:  

```
Host aliasName
    Hostname some.example.com
    Port 2222
    User username
```

Usage: `$ ssh aliasName`

# iTerm Specific
Pressing `<Command>` and `;` at the same time will open an autocomplete dropdown selection in iTerm.

# General Tricks
Searching for command history:  
`$ history` to see all recent commands  
`Control + r` to search through your recent history and use as your current command.

Count how many lines of code in a given directory:  
`$ find . -name "*.*" -exec wc -l {} \;`

Show your permission on a directory:  
`$ ls -ld <directory>`

Show the size of the files in a directory:  
`$ ls -lh`

Print certain files all in one column:
``` bash
$ ls -1. *.jpg # 1 column, JPGs
```

Mark file as not executable:  
`$ chmod -x fileName`

Copy contents of file to the clipboard:  
`$ cat file.txt | pbcopy` or `$ pbcopy < file.txt`

Show a mini calendar view:  
`$ cal`

Count number of columns in CSV file:  
`$ head -1 data_set/background-one.csv | sed 's/[^,]//g' | wc -c$

Open URLs without copy pasting:  
`Command + Click`

Delete word:  
`Control + w`

Grepping (Searches for string in directory):  
`grep -r someString .`. Useful [doc](https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/)

It's also helpful to note that you can use regexes on most commands. For example:

``` bash
killall -9 prefix_* # All processes that begin with "prefix_"
rm -f *_vs_* # Forcibly remove all files with names that have "_vs_" in them
```

I know this doesn't fall under the Terminal category, but I thought this was a cool trick. If you `Option` + `Click` on a window, all the other windows in that desktop will be hidden.

