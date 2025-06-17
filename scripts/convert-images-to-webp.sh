#!/bin/bash
set -e

echo "🔁 Image optimization: converting all .png/.jpg to .webp"

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

RAW_DIR="assets/raw_images"
mkdir -p "$RAW_DIR"

# Find all .png/.jpg/.jpeg files, excluding raw backups and .git
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

  # Backup original
  mv "$FILE" "$RAW_BACKUP" || { echo "⚠️ Failed to move $FILE"; continue; }

  # Resize + convert to .webp
  convert "$RAW_BACKUP" -resize 740x\> -quality 85 "$WEBP_FILE" || {
    echo "⚠️ Failed to convert $RAW_BACKUP"
    # Restore original if conversion fails
    mv "$RAW_BACKUP" "$FILE"
    continue
  }
done

echo "✅ Done: All images converted and backed up."
