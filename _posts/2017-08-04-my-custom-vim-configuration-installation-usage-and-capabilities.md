---
layout: post
title: "My Custom VIM Configuration: Installation, Usage, and Capabilities"
author: "Kevin Hou"
date: 2017-08-04 17:18:02
description: "My personal — and favorite — VIM configuration that includes most of the functionalities found in editors like Sublime and Atom, but in a faster, slicker, and more powerful package."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: Programming
tags: []
featured: "yes"
---
# Setting Up VIM
VIM is configured using a `.vimrc` file in your root directory (`~/.vimrc`) and serves as the configuration file. It is similar to a `.bashrc` or `.bash_profile` in the sense that it must be sourced to reflect changes, but VIM automatically takes care of when it launches. Ensure that the `~/.vimrc` file exists and if not, create one. Now here's how the complete setup:
<br class="post-line-break">
__Step 1__  
Copy/paste the contents of my configuration file into your `.vimrc` file or replace the file itself. This will give you all the configurations that I use. Before you are done, you need to install the packages that are used in the configuration.
<br class="post-line-break">
__Step 2__  
Like I said earlier, I'm using [vim-plug](https://github.com/junegunn/vim-plug) as my package manager service. Install `vim-plug` using:
{% highlight bash %}
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
{% endhighlight %}
<br class="post-line-break">
__Step 3__  
Open VIM - type `:` to open the VIM command line. You will be using this a lot. Type `PlugInstall` and press Enter.  
VIM has a handful of common "listener keys" that let VIM know you are about to perform a custom key command. This includes `:`, `,`, `/`, etc.  
<br class="post-line-break">
_Note_: Sometimes need to source the `.vimrc` file first:
{% highlight bash %}
:source %
:PlugInstall
{% endhighlight %}
<br class="post-line-break">
__Step 4__  
Install __MacVim__  
Some plugins will require a higher version of VIM than the out-of-the-box built-in default for Macs. Many references online have recommended using [MacVim](macvim-dev.github.io) and aliasing its CL interface to "replace" the default. Add this to your `.bash_profile` after you've installed MacVim:  
{% highlight bash %}
# Mac VIM Alias
alias vim='/Applications/MacVim.app/Contents/MacOS/Vim'
{% endhighlight %}
<br class="post-line-break">
__Step 5__  
There are a few plugins that require additional installations that don't get setup automatically using `vim-plug`. Follow the steps below to configure these libraries:  
<br class="post-line-break">
__`Pathogen` — Package loader__
{% highlight bash %}
mkdir -p ~/.vim/autoload ~/.vim/bundle && curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
{% endhighlight %}
<br class="post-line-break">
__`AG` - For project file grepping__
('AG' stands for the silver element in periodic table)
{% highlight bash %}
brew install the_silver_searcher
{% endhighlight %}

<br class="post-line-break">
__`YouCompleteMe` - Autocomplete__
1. Install Cmake: `$ brew install CMake`
    * On dev box (Ubuntu): `$ sudo apt-get install cmake`
2. Finish install: `$ python ~/.vim/plugged/YouCompleteMe/install.py`

<br class="post-line-break">
__`Solarized Colorscheme for VIM` — Theme__
1. Install into `bundle` folder. Create it if the directory doesn't exist.
{% highlight bash %}
$ cd ~/.vim/bundle
$ git clone git://github.com/altercation/vim-colors-solarized.git
{% endhighlight %}

2. Set the theme in `.vimrc`.
{% highlight bash %}
syntax enable
" Use 'light' if want the light theme
set background=dark
colorscheme solarized
{% endhighlight %}

<br class="post-line-break">
__NERDTree - Project Heiarchy in Sidebar__
1. Ensure you have a `~/.vim/bundle/` directory
2. Install using: `$ git clone https://github.com/scrooloose/nerdtree.git ~/.vim/bundle/nerdtree`
3. NERDTree will automatically open when VIM opens because of this command in the `.vimrc`:
{% highlight bash %}
autocmd vimenter * NERDTree
{% endhighlight %}

# Commands

<h3 class="post-subheader">VIM Environment</h3>
Launch VIM: `$ vim <file/directory (optional)>`  
Close current pane: `:q`  
Quitting all panes: `:qa`  
Save: `:w`  
Save & Quit: `:wq`  

<h3 class="post-subheader">Switching input modes</h3>
Highlight mode: `v`  
Insert mode (keyboard and arrow keys will work like normal): `i`  
Viewing mode (if in highlight or insert mode): `Esc`  

<h3 class="post-subheader">Navigating In-File (Non-Insert Mode)</h3>
Go to line: `<Line-Number>` + `Shift` + `G`  
Back one word: `b`  
Forward one word: `w`  
Move to first non-blank character of line (Like `Command + Left`): `_`  
Move to last non-blank character of line (Like `Command + Right`): `g_`  
Beginning of line: `0`  
End of line: `Shift + 4` (`$`)  
Page up: `Control + B`  
Page Down: `Control + F`  

__Arrow key mappings:__  
Up: `k`  
Down: `j`  
Left: `h`  
Right: `l`  

Move `x` positions: `<number> + <key>`  
Example: Move down 10 lines: `10 + j`  
__Note__: Syntax supported by all navigation commands

<h3 class="post-subheader">Opening Files</h3>
Fuzzy Search - Searches file names — `,t`
To cancel: `Command` + `C` or `:q`

<h3 class="post-subheader">Grepping</h3>
Global find (searches content of file in project) — `,a`  
The "current project" is whatever directory you `$ vim` into  

Search within file: `\<keyword on page>`
    * `n` goes to next
    * `Shift + N` goes back

Search and replace: `:%s/foo/bar/g` (Replace `foo` with `bar` no confirmation. For confirmation, use `gc` instead of `g` at end)

<h3 class="post-subheader">Highlighting mode</h3>
Highlighting an entire line: `Shift + V`
Highlighting mode: `v`
Copy/yank: `y`
Paste: `p`
Paste above: `Shift + P`
Pasting in insert mode (having copied using the operating system): `Command + v`
Paste from clipboard with auto-indenting: `:set paste` + `Command + V`


<h3 class="post-subheader">Panes</h3>
Opening new panes, start with: `control + w`:
    * `v` is vertical split (focus on the new pane)  
    * `s` is horizontal split  
    * `=` makes all panes equal size  

__Switch panes:__  
Move up: `control + j`  
Move down: `control + k`  
Move left: `control + h`  
Move right: `control + l`  
Close all except current: `control + o`  

<h3 class="post-subheader">Other</h3>
Undo: `u`  
Redo: `control` + `r`  

Delete: `d` --> Format: `d` + `number (optional, default 1)` + `action`  
`d` + `4` + `w` would delete the four next words

Creating new file from CL in VIM:
`$ vim <file-name>`  
Make sure you save before you quit using `:w`

Quitting: `:q`  
Quitting without saving (and not being prompted): `:q!`

__Using `easymotion`__  
Easymotion is a plugin that allows you to quickly move through the current file by highlighting all possible next positions for your cursor and adding a hotkey to them. Instead of typing `/div` and pressing `n` to cycle through to the instance of `div` that you're looking for in your code, you can simply type `s` to initiate the `easymotion` grepping, `di` as your two character query (configurable in `.vimrc` file), and type the key that is placed on the instance of what you're looking for.

__Commenting__  
To comment a line you've highlighted, type `gc`  
To comment a line without highlighting, type `gcc`

<h3 class="post-subheader">Explorer</h3>
Opening up explorer:  
`:Explore` or `:Exp` + `Tab` to complete it for you

Navigation using `hjkl`.  
When opening a file:
1. Enter opens in same pane
2. `o` splits horizontally (opens below)
3. `v` splits vertically (opens to the side)

`-` Up one level to parent

`gg` - top of file/pane
`Shift + G` - bottom
Go to line number: `<Line #> + Shift + G`

# Additional Plugins and Customizations
<h3 class="post-subheader">All Plugins</h3>
* comment_vim
* typescript-vim
* vim-fugitive
* supertab
* tabular
* rename.vim
* goyo.vim
* vim-vroom
* auto_mkdir
* ctrlp.vim
* ag.vim
* ctrlp-cmatcher
* ack.vim
* YouCompleteMe
* indentline
* vim-gitgutter
* vim-airline
* vim-multiple-cursors
* vim-easymotion

<h3 class="post-subheader">Languages</h3>
* vim-coffee-script
* vim-elixir
* vim-emoji
* vim-rails
* vim-javascript
* vim-jsx

# Further Customizations
<h3 class="post-subheader">Adding a Plug In</h3>
1. Add the plugin to the `.vimrc` file: `Plug 'Valloric/YouCompleteMe'`
2. Source the file: `:source %`
3. Install the plugins: `:PlugInstall`

<h3 class="post-subheader">Suggestions</h3>
1. Change `caps lock` to `escape` in System Preferecnes -> Keyboard -> Modifiers

<h3 class="post-subheader">In Development</h3>
* Undo closing a pane (reopen last pane)

<h3 class="post-subheader">FAQs</h3>
1. Does the mouse work? Yes!
3. Open VIM tutorial: `$ vimtutor`
4. What does `<C>` map to? It maps to `Control`
