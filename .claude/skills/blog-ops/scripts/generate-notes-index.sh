#!/bin/bash
# 自动生成学习笔记索引页 source/notes/index.md（按目录分组列出全部笔记）
# 用法: bash generate-notes-index.sh
set -e

BLOG=/d/Web/daynz.github.io
DIR="$BLOG/source/notes"
OUT="$DIR/index.md"
[ -d "$DIR" ] || { echo "目录不存在: $DIR"; exit 1; }
cd "$DIR"

{
  echo "---"
  echo "title: 学习笔记"
  echo "layout: page"
  echo "---"
  echo ""
  echo "# 📚 学习笔记"
  echo ""
  total=$(find . -name '*.md' ! -name 'index.md' | wc -l)
  echo "共 **$total** 篇笔记，按主题分类："
  echo ""

  # 顶层分类目录（八股/游戏引擎/编程语言/计算机基础）
  while IFS= read -r dir; do
    name=$(basename "$dir")
    count=$(find "$dir" -name "*.md" | wc -l)
    echo "## 📁 $name（$count 篇）"
    echo ""
    # 列出该目录下所有 md（保持相对路径）
    while IFS= read -r md; do
      rel="${md#./}"
      html="${rel%.md}.html"
      title=$(basename "$rel" .md)
      echo "- [$title]($html)"
    done < <(find "$dir" -name "*.md" | sort)
    echo ""
  done < <(find . -mindepth 1 -maxdepth 1 -type d | sort)

  # 根级 md（Plan.md / README.md 等）
  root_md=$(find . -maxdepth 1 -name '*.md' ! -name 'index.md' | sort)
  if [ -n "$root_md" ]; then
    echo "## 📄 其他"
    echo ""
    while IFS= read -r md; do
      rel="${md#./}"
      html="${rel%.md}.html"
      title=$(basename "$rel" .md)
      echo "- [$title]($html)"
    done <<< "$root_md"
    echo ""
  fi
} > "$OUT"

echo ">> 已生成 $OUT（$(grep -c '^- \[' "$OUT") 个链接）"
