# 仓库与网页结构

## 技术栈

- 静态站生成器：**Hexo 8.1.2**
- 主题：**Fluid**（`_config.fluid.yml` 是主题配置）
- Markdown 渲染：`hexo-renderer-markdown-it` + KaTeX（后端渲染公式）
- 其他插件：plantuml、html-minifier、archive/category/tag 生成器

## 仓库根目录（git 管理，= 网页静态站 + 源码）

```
daynz.github.io/
├── _config.yml            # 站点配置（标题、URL、permalink、插件等）
├── _config.fluid.yml      # Fluid 主题配置（配色、导航菜单、暗色模式等）
├── _config.landscape.yml  # 旧主题配置（未使用，可忽略）
├── package.json           # 依赖（含必要修复 overrides）
├── deploy.sh              # 部署脚本（唯一推荐部署方式）
├── .nojekyll              # 关闭 GitHub Pages 的 Jekyll 处理（必需）
├── source/                # ★ Hexo 源码目录（编辑的对象）
│   ├── _posts/            #   博客文章 + 学习笔记（.md）
│   │   └── notes/         #     笔记正文（作为 post，进归档/标签）
│   └── notes/             #   笔记索引页 + 图片静态资源
│       ├── index.md       #     笔记总索引页
│       └── 分类/.../assets/  #     笔记引用的图片（Hexo 静态复制）
├── themes/fluid/          # 主题源码（勿改，只读）
├── scaffolds/             # hexo new 的模板
├── scripts/               # 技能辅助脚本（.claude 下，见 SKILL.md）
│
│   ── 以下为部署生成的静态文件（由 public/ 同步而来，勿手工编辑）──
├── index.html             # 首页（文章列表）
├── notes/                 # 学习笔记页面（HTML）
├── 2026/08/               # 按日期归档的文章页
├── archives/              # 归档页
├── categories/            # 分类页
├── tags/                  # 标签页
├── links/                 # 友链页
├── xml/local-search.xml   # 本地搜索索引
├── local-search.xml       # 搜索索引（根）
├── 404.html               # 404 页
├── css/ js/ img/          # 主题静态资源
├── public/                # hexo 生成产物（gitignore，勿编辑）
├── .deploy_git/           # hexo d 的部署产物（gitignore，勿编辑，不用它部署）
└── db.json                # hexo 数据库缓存（gitignore）
```

## source/ 源码结构（编辑入口）

```
source/
├── _posts/        # 博客文章 + 学习笔记（都是 post，进归档/标签）
│   ├── xxx.md     #   hexo new 生成的文章。permalink = /YYYY/MM/DD/title/
│   └── notes/     #   学习笔记正文（按主题分类目录组织）
│       ├── Plan.md
│       ├── 八股/C++.md
│       └── 图形学/.../222光栅化/README.md
└── notes/         # 笔记索引页 + 笔记引用的图片（静态资源）
    ├── index.md         # 笔记总索引页（transform-index.js 生成，勿手改）
    ├── .obsidian/       # Obsidian 配置（git 忽略或共存，不用管）
    └── 八股/.../assets/ # 笔记 md 里的图片（保持相对目录，Hexo 静态复制）
```

## 导航菜单（网页布局）

`_config.fluid.yml` 的 `menu` 定义了顶栏导航：首页 `/`、笔记 `/notes/`、归档、分类、标签、关于。（友链 `/links/` 已被注释）

## 笔记页结构说明

- **笔记正文是 post**（在 `_posts/notes/`），通过 front-matter 的 `permalink` 固定为 `/notes/<路径>.html`，**会进入归档、标签和首页文章列表**
- `notes/index.md` 是**卡片式索引页 + 目录树**：按顶层分类目录分组（卡片），另含**可折叠目录树**（`<details>` 展示 分类→子目录→笔记 层级），均由 `transform-index.js` 自动生成，保证链接无死链
- **图片与正文分离**：md 在 `_posts/notes/`，图片在 `source/notes/` 对应路径（Hexo 只把 `source/` 下非 `_posts/` 的静态文件复制到 public）。渲染后 md 里的相对引用 `./assets/xxx.png` 基于 `/notes/...html` 解析，恰好指向 public 中的图片
- 笔记的 `tags` = 顶层分类名（八股/图形学/游戏引擎/编程语言/计算机基础/其他），由 `add-note-frontmatter.js` 自动写入
- 中文目录/文件名会保留在 URL 中，浏览器会自动编码，链接直接写中文相对路径即可

## 关键约定

- **URL**：`https://daynz.github.io`；文章默认 permalink `:year/:month/:day/:title/`；笔记用 front-matter `permalink` 固定为 `/notes/...`
- **语言**：zh-CN，时区 Asia/Shanghai
- **文章每页 10 篇**（首页/归档分页），笔记也参与分页
