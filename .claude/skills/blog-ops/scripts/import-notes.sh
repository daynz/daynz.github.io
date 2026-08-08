#!/bin/bash
# 导入学习笔记到博客（保持目录结构，只复制 md 和图片）
# 用法: bash import-notes.sh [源目录]
set -e

SRC="${1:-/d/Study/Notes/Notes}"
BLOG=/d/Web/daynz.github.io
DEST="$BLOG/source/notes"

if [ ! -d "$SRC" ]; then
  echo "错误: 源目录不存在: $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"
cd "$SRC"

echo ">> 复制 $SRC 中的 md 和图片到 $DEST ..."
find . -type f \( -iname "*.md" -o -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.webp" -o -iname "*.svg" \) -print0 \
  | tar --null -T - -cf - | (cd "$DEST" && tar xf -)

count=$(find "$DEST" -type f | wc -l)
echo ">> 完成！source/notes/ 现有 $count 个文件"
echo ">> 提示: 若之后 hexo g 报 YAMLException，运行 fix-front-matter.sh 修复，再 bash deploy.sh 部署"
