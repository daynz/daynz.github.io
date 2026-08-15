# 部署与本地预览

## 部署原理（务必理解，避免踩坑）

本仓库是**单分支方案**：`main` 同时存放 Hexo 源码和生成的静态站点。

- GitHub Pages 从 `main` 根目录直接发布静态文件（`index.html`、`notes/` 等）
- **因此不能用 `hexo d`**：`hexo-deployer-git` 会把 `main` force-push 成纯静态站，导致 `source/`、`_config.yml` 等源码全部丢失！
- 正确做法是用 `deploy.sh`：先 `hexo g` 生成到 `public/`，再**只覆盖同名静态文件**到仓库根（保留源码目录），最后 commit + push

## 一键部署

```bash
cd /d/Web/daynz.github.io && bash deploy.sh
```

`deploy.sh` 自动执行三步：

1. **`hexo clean && hexo g`** — 清理并生成静态站到 `public/`
   - 若此步报错，见 `troubleshoot.md`
   - 注意 plantuml 需联网渲染
2. **同步 `public/` 到仓库根** — 用 `tar` 管道覆盖同名文件，**不删除** `source/` 等源码目录
3. **commit + push** — `git add -A` → `git commit -m "deploy: update site ..."` → `git push origin main`

> 若无变更，`git commit` 会打印"（无变更，跳过提交）"，这是正常现象。

## 手动部署（不推荐，仅排查时用）

```bash
cd /d/Web/daynz.github.io
hexo clean && hexo g        # 生成到 public/
(cd public && tar cf - .) | tar xf - .   # 同步到根目录
git add -A && git commit -m "deploy: update site"
git push origin main
```

## 本地预览

```bash
cd /d/Web/daynz.github.io && hexo server --port 4000
# 访问 http://localhost:4000 ，确认无误后再部署
# 注意：预览完记得停掉进程（Ctrl+C），避免占用端口
```

## 部署前检查清单

1. `git branch --show-current` 确认在 `main`
2. `git status` 确认工作区无未预期的改动
   - `.deploy_git/`、`node_modules/`、`public/` 已被 `.gitignore` 忽略，不会误提交
3. `hexo g` 无报错（重要内容：plantuml 需联网、公式 `$$` 内不能有空行）
4. 推送后到 https://daynz.github.io 验证（GitHub Pages 一般 1 分钟内生效）
