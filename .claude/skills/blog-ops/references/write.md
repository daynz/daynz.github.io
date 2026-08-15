# 写文章与导入/更新学习笔记

## 1. 写新博客文章

```bash
cd /d/Web/daynz.github.io
hexo new "文章标题"            # 生成 source/_posts/文章标题.md
# 用编辑器填写 front-matter 与正文
bash deploy.sh                # 部署
```

支持的内容语法（见 `_config.yml` 配置）：

| 类型 | 写法 | 注意 |
|---|---|---|
| 公式 | `$...$` / `$$...$$` | **`$$` 内不能有空行**；`$` 后不能直接跟空格 |
| 流程图 | ` ```mermaid ` | 语言名填 mermaid |
| UML | ` ```plantuml ` | **必须含 `@startuml` / `@enduml`** |
| 代码块 | ` ```语言名 ` | 自动高亮（highlight.js） |

> `source/_posts/` 下已有 `hello-world.md`、`test-features.md` 可参考语法写法。

## 2. 导入/更新学习笔记

> 笔记采用"正文/图片分离"结构：md 进 `source/_posts/notes/`（作为 post，进归档/标签），图片进 `source/notes/`（静态资源）。

### 2a. 复制笔记源（推荐）

```bash
cd /d/Web/daynz.github.io
bash .claude/skills/blog-ops/scripts/import-notes.sh "D:/Study/Notes/Notes"
```

- 只复制 `.md`（→ `_posts/notes/`）和图片 png/jpg/gif/webp/svg（→ `source/notes/`），保持目录结构
- 源目录是独立 git 仓库，脚本只读复制，**不会修改原文件**
- 复制后 `source/notes/.obsidian/` 等隐藏目录也会进来，无需处理

### 2b. 给笔记加 front-matter（permalink + tags）

导入的新笔记**必须**跑这个脚本，否则它们没有 `permalink`（URL 会变成 `/YYYY/MM/DD/标题/`）也没有 tags（进不了标签页）：

```bash
node .claude/skills/blog-ops/scripts/add-note-frontmatter.js
```

- 自动为 `_posts/notes/` 下每篇 md 写 `permalink: /notes/<路径>.html` + `tags: [顶层分类名]`
- 已有 front-matter 的保留原 title/date；README 用父目录名做 title
- 幂等：已处理过的不会重复添加

### 2c. 重新生成笔记索引

```bash
node .claude/skills/blog-ops/scripts/transform-index.js
```

- 扫描 `source/_posts/notes/` 目录结构，重新生成 `source/notes/index.md`（卡片式 + 可折叠目录树）
- 链接用 `/notes/<路径>.html` 绝对路径（与 permalink 一致），自动分组分类、计算计数、无死链
- 若缺 Node，可回退 `bash .claude/skills/blog-ops/scripts/generate-notes-index.sh`（旧版）

### 2d. 修复 front-matter 误判（若 hexo g 报错）

```bash
bash .claude/skills/blog-ops/scripts/fix-front-matter.sh
```

- 用于修复 YAMLException（详见 `troubleshoot.md`）

### 2e. 部署

```bash
bash deploy.sh
```

## 3. 修改笔记内容

- 编辑正文：`source/_posts/notes/` 下对应 `.md`
- 改文件名/目录（增删篇目）后：重跑 `add-note-frontmatter.js`（更新 permalink）+ `transform-index.js`（更新索引），再部署
- 图片：新增图片放到 `source/notes/` 对应路径（保持 md 里的相对引用 `./assets/xxx.png` 能解析）

**注意**：编辑笔记源后，若源笔记后续在 `D:\Study\Notes\Notes` 更新，重新跑 `import-notes.sh` 会覆盖同名文件 —— 若你在博客里改过内容，记得先同步回源或用不同文件名。

## 4. 修改主题 / 站点配置

- 主题配置 → `_config.fluid.yml`（配色、菜单、暗色模式等）
- 站点配置 → `_config.yml`（URL、permalink、插件开关等）
- 改完 `hexo g` 验证无报错，再 `bash deploy.sh`
- 自定义 CSS/JS 参考根目录 `css/`、`js/` 里的现有文件
