#!/bin/bash
# 修复 hexo 的 front-matter 误判问题：
# 不以 `---` 开头、但中间含独立 `---` 行的 md，会被 hexo-front-matter 当 YAML 解析而报
# YAMLException: name of an alias node must contain at least one character
# 解决办法：给这些 md 在开头插入标准 front-matter。
set -e

BLOG=/d/Web/daynz.github.io
DIR="$BLOG/source/notes"
[ -d "$DIR" ] || { echo "目录不存在: $DIR"; exit 1; }

cd "$DIR"
count=0
while IFS= read -r -d '' f; do
  if ! head -1 "$f" | grep -qE '^(-{3,}|;{3,})'; then
    if grep -qE '^-{3,}' "$f"; then
      title=$(basename "$f" .md)
      tmp="$f.tmpfix"
      { printf -- '---\ntitle: "%s"\ndate: 2026-08-08 17:00:00\n---\n\n' "$title"; cat "$f"; } > "$tmp" && mv "$tmp" "$f"
      count=$((count+1))
      echo "fixed: $f"
    fi
  fi
done < <(find . -type f -name "*.md" -print0)

echo "=== 共修复 $count 个文件的 front-matter ==="
