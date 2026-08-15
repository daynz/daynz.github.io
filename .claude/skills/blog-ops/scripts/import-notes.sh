#!/bin/bash
# 导入学习笔记到博客（正文/图片分离）：
#   - .md  → source/_posts/notes/  （作为 post，进归档/标签）
#   - 图片 → source/notes/          （静态资源，Hexo 复制到 public/notes/）
# 保持目录结构。只复制，不修改源。
# 用法: bash import-notes.sh [源目录]
set -e

SRC="${1:-/d/Study/Notes/Notes}"
BLOG=/d/Web/daynz.github.io
MD_DEST="$BLOG/source/_posts/notes"
IMG_DEST="$BLOG/source/notes"

if [ ! -d "$SRC" ]; then
  echo "错误: 源目录不存在: $SRC" >&2
  exit 1
fi

mkdir -p "$MD_DEST" "$IMG_DEST"

echo ">> 复制 md 到 $MD_DEST ..."
(cd "$SRC" && find . -iname "*.md" -print0 | tar --null -T - -cf -) | (cd "$MD_DEST" && tar xf -)

echo ">> 复制图片到 $IMG_DEST ..."
(cd "$SRC" && find . -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" \) -print0 | tar --null -T - -cf -) | (cd "$IMG_DEST" && tar xf -)

md_count=$(find "$MD_DEST" -name "*.md" | wc -l)
img_count=$(find "$IMG_DEST" -type f ! -name "*.md" ! -name "index.md" | wc -l)
echo ">> 完成！_posts/notes/ 现有 $md_count 个 md，notes/ 现有 $img_count 个图片"
echo ">> 下一步:"
echo "  1) node .claude/skills/blog-ops/scripts/add-note-frontmatter.js   # 加 permalink+tags"
echo "  2) node .claude/skills/blog-ops/scripts/transform-index.js        # 更新索引页"
echo "  3) bash deploy.sh                                                # 部署"
