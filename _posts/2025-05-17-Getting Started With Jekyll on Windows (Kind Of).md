---
title: Getting Started With Jekyll on Windows (Kind Of)
date: 2025-05-17
layout: post
author: Jim Smits
permalink: 
thread: 
description: Jekyll is probably the most well-known static site generator around. It has thousands of stars and watchers on GitHub. Here's how to get started with it on Windows.
tags:
  - jekyll
  - WSL
  - website-development
  - how-to
ai-disclaimer: Created by Jim Smits, Edited with ChatGPT, Scripts by ChatGPT
---
[Jekyll](https://jekyllrb.com/) is probably the most well-known static site generator around. It has thousands of stars and watchers on GitHub, and while development has slowed since its peak in 2013, it is still actively maintained. According to the [GitHub site](https://github.com/jekyll/jekyll):

> Jekyll is a simple, blog-aware, static site generator perfect for personal, project, or organization sites. Think of it like a file-based CMS, without all the complexity. [...] Jekyll is the engine behind [GitHub Pages](https://pages.github.com), which you can use to host sites right from your GitHub repositories.

What's not to like about that?  However, Jekyll is written in [Ruby](https://www.ruby-lang.org/en/) and Ruby support on Windows is... well, questionable at best. There is a Ruby Installer for Windows, but it can be quirky.

# WSL to the Rescue

Windows Subsystem for Linux (WSL) is THE best way to run Ruby from a Windows machine. When you use WSL, you are actually using Linux which is key to avoiding all the Ruby quirks on Windows.

To get started, install WSL.

1. Open a PowerShell terminal with admin privileges and run `wsl --install`. This will install WSL with Ubuntu as the default OS. You may need to restart your computer. 
2. Open Ubuntu from the Start Menu like you would with any other program.
3. When prompted, create a Linux user name and password.
4. Finally, run the following commands to install Jekyll.

```
# update package lists and install latest versions
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential ruby-full zlib1g-dev libffi-dev

# add Ruby to your path
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# install Jekyll
gem install jekyll bundler

# create a Jekyll site
jekyll new my-site
cd my-site
bundle install

# fire it up
bundle exec jekyll serve
```

Then go to `http://localhost:4000` in your Windows browser of choice.  Congrats.  You just installed Jekyll on Windows (kind of).