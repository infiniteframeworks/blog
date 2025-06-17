#!/bin/bash
set -e

echo "🔁 Image optimization: converting images to .webp and resizing existing .webp"

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

RAW_DIR="assets/raw_images"
mkdir -p "$RAW_DIR"

# Step 1: Convert and resize all .png/.jpg/.jpeg
FILES=$(find . \
  -type f \
  -iregex '.*\.\(png\|jpe?g\)$' \
  -not -path './assets/raw_images/*' \
  -not -path './.git/*')

for FILE in $FILES; do
  [ -f "$FILE" ] || continue

  BASENAME=$(basename "$FILE")
  WEBP_FILE="${FILE%.*}.webp"
  RAW_BACKUP="$RAW_DIR/$BASENAME"

  echo "📦 $FILE → $WEBP_FILE (raw saved to $RAW_BACKUP)"

  mv "$FILE" "$RAW_BACKUP" || { echo "⚠️ Failed to move $FILE"; continue; }

  convert "$RAW_BACKUP" -resize 740x\> -quality 85 "$WEBP_FILE" || {
    echo "⚠️ Failed to convert $RAW_BACKUP"
    mv "$RAW_BACKUP" "$FILE"
    continue
  }
done

# Step 2: Resize existing .webp files if needed
WEBP_FILES=$(find . \
  -type f \
  -iname '*.webp' \
  -not -path './assets/raw_images/*' \
  -not -path './.git/*')

for WEBP in $WEBP_FILES; do
  echo "🔧 Resizing existing $WEBP to max width 740px"
  convert "$WEBP" -resize 740x\> -quality 85 "$WEBP"
done

echo "✅ Done: All images converted, resized, and backed up."
