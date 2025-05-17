---
title: Publish To Jekyll on WSL From Windows Obsidian
date: 2025-05-18
layout: post
author: Jim Smits
permalink: /publish-to-jekyll-from-obsidian/
thread:
---
## The Script

The trick to know and get started with here is that you can access your windows file system from  your WSL instance at `/mnt/c`.  

From there it is easy to sync with a bash script.

```
#!/bin/bash

# Windows (Obsidian) path
WIN_ROOT="/mnt/c/Users/Path/To/Your/ObsidianFiles"
WSL_ROOT="/home/<username>/jekyll-site"

# Sync _posts both ways
rsync -avu "$WIN_ROOT/_posts/" "$WSL_ROOT/_posts/"
rsync -avu "$WSL_ROOT/_posts/" "$WIN_ROOT/_posts/"

# Sync _drafts both ways
rsync -avu "$WIN_ROOT/_drafts/" "$WSL_ROOT/_drafts/"
rsync -avu "$WSL_ROOT/_drafts/" "$WIN_ROOT/_drafts/"

# Sync assets both ways
rsync -avu "$WIN_ROOT/assets/" "$WSL_ROOT/assets/"
rsync -avu "$WSL_ROOT/assets/" "$WIN_ROOT/assets/"
```

Save this as `sync_obsidian.sh` on your WSL instance.

## The Setup

You could control this any number of ways, but I set my obsidian vault up as follows:

```
C:.
├───.obsidian
├───assets
│   └───images
│       └───posts
├───_drafts
├───_posts
└───_templates
```

Then I added `_drafts` and `sync_obsidian.sh` to my `.gitignore` file to prevent sensitive information and unfinished drafts from getting into source control. 

Now, if I make a change in either location - just run the script from WSL and boom - it syncs both ways.

#jekyll #obsidian #WSL #productivity