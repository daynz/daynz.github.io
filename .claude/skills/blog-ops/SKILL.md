---
name: blog-ops
description: 管理 daynz 的 Hexo 博客（daynz.github.io）。当用户要求写博客文章、导入/更新学习笔记、部署博客、本地预览、修改博客主题或配置、处理博客构建/部署错误时，使用此技能。
---

# 博客操作（Blog Ops）

管理 daynz 的 Hexo 博客仓库 `D:\Web\daynz.github.io`。

## 仓库背景

- **单分支结构**：只有 `main`，同时包含 Hexo 源码和生成的静态站点
  - 源码：`source/`、`_config.yml`、`_config.fluid.yml`、`package.json`
  - 静态站：`index.html`、`notes/`、`css/`、`js/`（GitHub Pages 从 `main` 根目录发布）
- `.nojekyll` 已在仓库根（关闭 Jekyll，否则源码 md 会 404）
- 技术栈：主题 **Fluid**（`_config.fluid.yml`）、渲染器 **markdown-it + KaTeX**、支持 **mermaid / plantuml** / 代码高亮

## 关键规则（务必遵守）

1. **禁止 `hexo d`**：它会 force push 覆盖 `main` 为纯静态站、删掉全部源码。**部署一律用 `bash deploy.sh`**
2. 任何操作前确认在 `main` 分支：`git branch --show-current`
3. 笔记源 `D:\Study\Notes\Notes` 是独立 git 仓库，**只复制、绝不修改原文件**

## 操作流程

### 1. 写新博客文章

```bash
cd /d/Web/daynz.github.io
hexo new "文章标题"            # 生成 source/_posts/标题.md
# 编辑文章，支持：
#   公式   $..$  /  $$..$$（$$ 内不能有空行）
#   流程图 ```mermaid
#   UML    ```plantuml（必须含 @startuml/@enduml）
#   代码块 ```语言名（自动高亮）
bash deploy.sh                # 部署
```

### 2. 导入 / 更新学习笔记

```bash
cd /d/Web/daynz.github.io
# 复制笔记（md + 图片）到 source/notes/，保持目录结构
bash .claude/skills/blog-ops/scripts/import-notes.sh "D:/Study/Notes/Notes"
# 若 hexo g 报 YAMLException（含独立 --- 行的 md 被 hexo 误判为 front-matter），运行修复：
bash .claude/skills/blog-ops/scripts/fix-front-matter.sh
bash deploy.sh
```

### 3. 本地预览

```bash
cd /d/Web/daynz.github.io && hexo server --port 4000
# 访问 http://localhost:4000 ，记得用完后停掉进程
```

### 4. 部署

```bash
cd /d/Web/daynz.github.io && bash deploy.sh
# deploy.sh 自动执行：hexo clean && hexo g → 同步 public 到仓库根（保留源码）→ commit → push
```

### 5. 修改主题 / 配置

- 主题配置改 `_config.fluid.yml`（**勿改** `node_modules/hexo-theme-fluid/` 里的源文件）
- 站点配置改 `_config.yml`
- 修改后必须 `hexo g` 验证无报错，再 `bash deploy.sh`

## 已知坑与注意事项

- **strip-ansi bug**：hexo 8.1.2 依赖 ESM 版 strip-ansi 却用 `require()`，`package.json` 的 `overrides: {"strip-ansi": "6.0.1"}` 是必要修复，**不要删除**
- **front-matter 误判**：hexo-front-matter 会把「不以 `---` 开头但中间含独立 `---` 行」的 md 当 YAML 解析报错 → 用 `fix-front-matter.sh` 插入标准 front-matter
- **plantuml**：在线渲染（plantuml.com），`hexo g` 需联网；国内慢/失败可换自托管 server 或 `render: Local`（需 Java）
- **公式**：`$$` 内不能有空行；`$` 后不能直接跟空格
- 笔记中文路径的 URL 访问需要编码（浏览器自动处理）；图片/相对链接保持原结构
- 部署前先 `git status` 确认工作区无未预期的改动（`.deploy_git/`、`node_modules/`、`public/` 已被 gitignore）
