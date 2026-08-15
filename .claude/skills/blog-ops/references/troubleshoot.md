# 已知坑与排错

## 1. front-matter 误判（YAMLException）

**症状**：`hexo g` 报错，类似
`YAMLException: name of an alias node must contain at least one character`

**原因**：hexo-front-matter 会把「不以 `---` 开头、但中间含独立 `---` 行」的 md 当 YAML 解析（常见于 Obsidian 笔记，md 内嵌了代码块或分割线）。

**修复**：

```bash
bash .claude/skills/blog-ops/scripts/fix-front-matter.sh
# 给问题 md 在开头插入标准 front-matter
```

### 1b. CRLF 行尾导致脚本误判 front-matter（Windows）

**症状**：`add-note-frontmatter.js`（或任何用 `/^---\n/` 判断 front-matter 的脚本）把**已有 front-matter** 的 md 误判为无，在开头又插入一份，产生**双重 front-matter**（`date` 等原字段被挤成正文）。

**原因**：Windows 下 `git config core.autocrlf = true` 时，工作区文本文件被转成 CRLF（`---\r\n`），`/^---\n/` 匹配不到。

**解决**：识别 front-matter 的正则必须兼容 CRLF：`/^---\r?\n/`。若已造成双重 front-matter，先恢复原始文件再重跑脚本：

```bash
git -c core.quotepath=false show HEAD:<原路径> > source/_posts/notes/<相对路径>
node .claude/skills/blog-ops/scripts/add-note-frontmatter.js
```

## 2. strip-ansi bug（hexo 8.1.2 依赖问题）

**症状**：`hexo g` 或 `hexo new` 直接崩溃，报 ESM/require 相关错误。

**原因**：hexo 8.1.2 依赖 ESM 版 strip-ansi 却用 `require()` 加载。

**修复**：`package.json` 里的 `overrides: {"strip-ansi": "6.0.1"}` 是必要修复，**绝对不要删除**。若已删除，重新加回后 `npm install`。

## 3. plantuml 渲染失败

**症状**：`hexo g` 卡住、报网络错误，或 UML 图变成坏链接。

**原因**：plantuml 用的是**在线渲染**（`https://www.plantuml.com/plantuml`），`hexo g` 需要联网，且在国内访问慢/不稳定。

**处理**：
- 重试 `hexo g`
- 或改 `_config.yml` 的 `plantuml` 段为自托管 server
- 或改 `render: "Local"`（需要本机装 Java + plantuml.jar）

## 4. 公式渲染问题

- **`$$` 内不能有空行**（会解析失败）
- `$` 后不能直接跟空格（如 `$ x $` 不会渲染）
- 若公式显示异常，检查是否违反上述两条

## 5. 部署后线上没更新

- GitHub Pages 一般 1 分钟内生效，稍等刷新（Ctrl+F5 强制刷新清缓存）
- 确认 push 成功：`git status` 干净、`git log` 看到 `deploy: update site ...` 提交
- 确认 `.nojekyll` 存在（已在根目录，**不要删**，否则源码 md 会 404）

## 6. 误用了 `hexo d`（危险！）

`hexo d` 会把 `main` force-push 成纯静态站、**删掉全部源码**（`source/`、`_config*.yml` 等）。

**若已发生且本地还有源码**：不要 push 任何东西，联系主人评估。若本地源码完好，可用 `git log` 找回：源码目录其实也在 git 历史里（因为 main 一直保留源码），找到最后一个含源码的 commit 用 `git reset --hard <commit>` 恢复。

**预防**：永远用 `bash deploy.sh`，它会自动 `hexo clean && hexo g` 而不是 deploy。

## 7. 其他

- **中文路径**：笔记 URL 里的中文会由浏览器自动编码，链接直接写中文相对路径即可，无需手动编码
- **工作区脏**：部署前 `git status`，`.deploy_git/`、`node_modules/`、`public/` 已被 gitignore，正常不会出现在列表里
- **hexo new 的文章名**：会变成 permalink 的一部分（`/YYYY/MM/DD/标题/`），尽量用简短英文或拼音避免 URL 过长
