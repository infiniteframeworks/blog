---
title: Enabling Tags In Jekyll on GitHub Pages
date: 2025-05-18
layout: post
author: Jim Smits
permalink: /enabling-tags-in-jekyll-on-github-pages/
thread: https://chatgpt.com/c/682964b3-e6a4-8004-90a0-70958ac67a59
description: Perhaps the only downside to using GitHub Pages to host a Jekyll blog is that its whitelist of approved plugins is limited. It doesn't support any Jekyll tagging plugins, so you have to roll your own. Jekyll's flexibility makes this easy to complete.
tags:
  - jekyll
  - github-pages
  - how-to
---
Perhaps the only downside to using GitHub Pages to host a Jekyll blog is that its [whitelist](https://pages.github.com/versions/) of approved plugins is limited. It doesn't support any Jekyll tagging plugins, so you have to roll your own. Jekyll's flexibility makes this easy to complete. 

# 1. Tag Your Posts

First, you have to have tagged your posts in the frontmatter.  

```
---
title: "My Post"
date: 2025-05-18
tags: 
 - jekyll 
 - blogging
 - how-to
---
```

Note that Obsidian (the notetaking software that I use to maintain my blog posts) uses YAML to store the tags.  

If your editor of choice uses an array to store the tags, it may look slightly different.

```
---
title: "My Post"
date: 2025-05-18
tags: [jekyll, blogging, how-to]
---
```

This will be important later on as we will use RegEx to extract the tags from the posts as a part of our script.

# 2. Render Tags in your Post Template

This is optional, but if you want to display your tags on the posts themselves, you need to add this snippet to your `_layouts/post.html` file.

```
{% if page.tags %}
  <ul class="post-tags">
    {% for tag in page.tags %}
      <li><a href="/tags/{{ tag | slugify }}/">{{ tag }}</a></li>
    {% endfor %}
  </ul>
{% endif %}
```

# 3. Add a Tags Page

This is the page where your tags will display. In the root of your site, add a `tags.html` file with this content:

```
---
layout: default
title: Tags
---

<h1>Tags</h1>
<ul>
  {% assign tags = site.tags %}
  {% for tag in tags %}
    <li>
      <a href="/tags/{{ tag[0] | slugify }}/">{{ tag[0] }} ({{ tag[1].size }})</a>
    </li>
  {% endfor %}
</ul>

```

# 4. Create a Generate Tags Script

If your tags are stored in YAML, like mine are, here is the script:
```
#!/bin/bash

POSTS_DIR="_posts"
TAG_DIR="tags"
LAYOUT="tag"
PERMALINK_BASE="/tags"

mkdir -p "$TAG_DIR"
> .all_tags.tmp

# Extract tags from front matter
for FILE in "$POSTS_DIR"/*; do
  in_frontmatter=false
  in_tags=false

  while IFS= read -r line; do
    # Detect start/end of front matter
    if [[ "$line" == "---" ]]; then
      if $in_frontmatter; then
        break
      else
        in_frontmatter=true
        continue
      fi
    fi

    # Parse tags
    if $in_frontmatter; then
      if [[ "$line" =~ ^tags: ]]; then
        in_tags=true
        continue
      fi

      if $in_tags; then
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]*(.+)$ ]]; then
          tag="${BASH_REMATCH[1]}"
          echo "$tag" >> .all_tags.tmp
        elif [[ ! "$line" =~ ^[[:space:]]*- ]]; then
          in_tags=false
        fi
      fi
    fi
  done < "$FILE"
done

# Generate unique, slugified tag pages
sort -u .all_tags.tmp | while read -r TAG; do
  SLUG=$(echo "$TAG" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
  FILE="$TAG_DIR/$SLUG.md"
  cat > "$FILE" <<EOF
---
layout: $LAYOUT
tag: $TAG
permalink: $PERMALINK_BASE/$SLUG/
---
EOF
  echo "Generated: $FILE"
done

rm .all_tags.tmp
```

If your tags are in array, use this script instead.

```
#!/bin/bash

POSTS_DIR="_posts"
TAG_DIR="tags"
LAYOUT="tag"
PERMALINK_BASE="/tags"

mkdir -p "$TAG_DIR"

# Extract tags from all posts
TAGS=$(grep -h "^tags:" "$POSTS_DIR"/* | \
  sed -e 's/^tags:[[:space:]]*//' -e 's/\[//;s/\]//' -e 's/,/ /g' | \
  tr ' ' '\n' | sort -u | grep -v '^$')

# Generate one page per tag
for TAG in $TAGS; do
  SLUG=$(echo "$TAG" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
  FILE="$TAG_DIR/$SLUG.md"
  cat > "$FILE" <<EOF
---
layout: $LAYOUT
tag: $TAG
permalink: $PERMALINK_BASE/$SLUG/
---
EOF
  echo "Generated: $FILE"
done

```

# 5. Make the Script Executable

Run this in your terminal.

```
# make the script executable
chmod +x generate_tags.sh
# run the script.
./generate_tags.sh

```

You should now see a folder called tags with a .md file for each of the tags in your frontmatter.

When you go to `yoursite.com/tags` you will see a list of tags.  Clicking on any of them will take you to `yoursite.com/tags/tagname` with a list of links to tagged posts. And your posts will have a list of tags at the bottom. Very nice!

# Bonus Points - Pre-Commit Hook

However, you don't want to have to remember to run this manually before you commit, so set it to run in a pre-commit hook.

Create the hook and set it to be executable: 
```
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Add the code to the script:
```
#!/bin/bash

echo "Generating tag pages..."
./generate_tags.sh

# Optionally: add generated files to the commit
git add tags/

```

Now, every time you commit, git will run the script.