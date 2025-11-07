#!/bin/bash

POSTS_DIR="_posts"
OUTPUT_FILE="assets/data/tags-graph.json"

mkdir -p "$(dirname "$OUTPUT_FILE")"

echo '{' > "$OUTPUT_FILE"
echo '  "nodes": [' >> "$OUTPUT_FILE"

declare -A tag_map
declare -A written_nodes

for post_file in "$POSTS_DIR"/*.md; do
  title=""
  permalink=""
  tags=()

  inside_frontmatter=false
  inside_tags=false

  while IFS= read -r line || [ -n "$line" ]; do
    # Start or end of frontmatter
    if [[ "$line" == "---" ]]; then
      if $inside_frontmatter; then
        break  # end of frontmatter
      else
        inside_frontmatter=true
        continue
      fi
    fi

    $inside_frontmatter || continue

    # Parse title
    if [[ "$line" =~ ^title:\ *(.*) ]]; then
      title="${BASH_REMATCH[1]//\"/}"
      continue
    fi

    # Parse permalink
    if [[ "$line" =~ ^permalink:\ *(.*) ]]; then
      permalink="${BASH_REMATCH[1]//\"/}"
      continue
    fi

    # Parse start of tags block
    if [[ "$line" =~ ^tags:\ *$ ]]; then
      inside_tags=true
      continue
    fi

    # Parse tag values
    if $inside_tags; then
      if [[ "$line" =~ ^[[:space:]]*-\ +(.*) ]]; then
        tag="${BASH_REMATCH[1]}"
        tags+=("$tag")
      elif [[ ! "$line" =~ ^[[:space:]]*-\  ]]; then
        inside_tags=false  # end of tag block
      fi
    fi
  done < "$post_file"

  # Skip posts without required fields
  [[ -z "$title" || -z "$permalink" ]] && continue

  post_id="post-${title// /-}"
  echo "    { \"id\": \"$post_id\", \"label\": \"$title\", \"type\": \"post\", \"url\": \"$permalink\" }," >> "$OUTPUT_FILE"
  written_nodes["$post_id"]=1

  for tag in "${tags[@]}"; do
    tag_map["$tag"]+="$title"$'\n'
  done
done

# Add tag nodes
for tag in "${!tag_map[@]}"; do
  tag_id="tag-${tag// /-}"
  echo "    { \"id\": \"$tag_id\", \"label\": \"$tag\", \"type\": \"tag\", \"url\": \"/tags/${tag// /-}/\" }," >> "$OUTPUT_FILE"
  written_nodes["$tag_id"]=1
done

# Clean trailing comma in nodes
truncate -s -2 "$OUTPUT_FILE"
echo '  ],' >> "$OUTPUT_FILE"

# Add links
echo '  "links": [' >> "$OUTPUT_FILE"
for tag in "${!tag_map[@]}"; do
  tag_id="tag-${tag// /-}"
  while IFS= read -r title; do
    [[ -z "$title" ]] && continue
    post_id="post-${title// /-}"
    echo "    { \"source\": \"$tag_id\", \"target\": \"$post_id\" }," >> "$OUTPUT_FILE"
  done <<< "${tag_map["$tag"]}"
done
truncate -s -2 "$OUTPUT_FILE"
echo '  ]' >> "$OUTPUT_FILE"
echo '}' >> "$OUTPUT_FILE"

echo "✅ Graph data written to $OUTPUT_FILE"
