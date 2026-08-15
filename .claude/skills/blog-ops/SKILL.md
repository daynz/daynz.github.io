---
name: blog-ops
description: 管理 daynz 的 Hexo 博客（daynz.github.io）。当用户要求写博客文章、导入/更新学习笔记、部署博客、本地预览、修改博客主题或配置、处理博客构建/部署错误时，使用此技能。
---

# 博客操作（Blog Ops）

管理 daynz 的 Hexo 博客仓库 `D:\Web\daynz.github.io`。

本技能采用**渐进式读取**：本文件只含概览与任务路由，细节按需读取 `references/` 子文件。

## 铁律（违反会损坏仓库，务必遵守）

1. **禁止 `hexo d`**：它会 force push 覆盖 `main` 为纯静态站、删掉全部源码。部署一律用 `bash deploy.sh`
2. 任何操作前确认在 `main` 分支：`git branch --show-current`
3. 笔记源 `D:\Study\Notes\Notes` 是独立 git 仓库，**只复制、绝不修改原文件**
4. **勿改** `node_modules/hexo-theme-fluid/` 里的主题源文件，主题配置只改 `_config.fluid.yml`
5. 不要删除 `package.json` 里的 `overrides: {"strip-ansi": "6.0.1"}`（修复 hexo 8 的依赖 bug）

## 任务路由（按需读取）

| 想做什么 | 先读 |
|---|---|
| 部署 / 本地预览 | `references/deploy.md` |
| 了解仓库 / 网页结构 | `references/structure.md` |
| 写文章 / 导入或更新学习笔记 | `references/write.md` |
| 构建 / 部署报错 | `references/troubleshoot.md` |

## 常用命令速查

```bash
cd /d/Web/daynz.github.io
hexo new "标题"        # 新建文章 → source/_posts/标题.md
bash deploy.sh         # 一键部署（hexo clean && hexo g → 同步到根 → commit → push）
hexo server --port 4000  # 本地预览 → http://localhost:4000
```

## 辅助脚本（`scripts/`）

| 脚本 | 用途 |
|---|---|
| `import-notes.sh` | 导入笔记源：md → `_posts/notes/`（post），图片 → `source/notes/`（静态资源） |
| `add-note-frontmatter.js` | 给 `_posts/notes/` 下 md 批量写 `permalink: /notes/…` + `tags`（导入后必跑） |
| `fix-front-matter.sh` | 修复 hexo 把 md 误判为 YAML 的报错 |
| `transform-index.js` | 扫描 `_posts/notes/` **重新生成**卡片式索引 `source/notes/index.md`（推荐） |
| `generate-notes-index.sh` | 旧版简单列表索引（已被 `transform-index.js` 取代，仅作回退） |
