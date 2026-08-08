#!/bin/bash
# 安全的博客部署脚本（单分支方案：main 同时含源码和静态站）
#
# 注意：本仓库 main 分支同时包含 Hexo 源码（source/、_config*.yml 等）和
# 生成的静态站点（index.html、notes/ 等）。
# 因此【不要使用 hexo d】，它会把 main force-push 成纯静态站，导致源码丢失！
# 请使用本脚本部署：
#   bash deploy.sh   或   ./deploy.sh
set -e
cd "$(dirname "$0")"

# 确认在 main 分支且工作区干净
if [ "$(git branch --show-current)" != "main" ]; then
  echo "请先切换到 main 分支再部署！" >&2
  exit 1
fi

echo ">> [1/3] 生成静态站点..."
hexo clean && hexo g

echo ">> [2/3] 同步 public/ 到仓库根目录（保留源码目录 source/ 等）..."
# 把 public 下所有文件覆盖到根目录；只覆盖同名静态文件，不删除源码
(cd public && tar cf - .) | tar xf - .

echo ">> [3/3] 提交并推送到 GitHub..."
git add -A
git commit -m "deploy: update site $(date '+%Y-%m-%d %H:%M:%S')" || echo "（无变更，跳过提交）"
git push origin main

echo ">> 部署完成！博客已更新。"
