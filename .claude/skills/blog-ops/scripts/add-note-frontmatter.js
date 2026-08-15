#!/usr/bin/env node
/**
 * 为 source/_posts/notes/ 下的笔记批量写入 front-matter：
 * - permalink: /notes/<相对路径>.html  （保持 /notes/ URL 不变）
 * - tags: [顶层分类名]                  （八股/图形学/游戏引擎/编程语言/计算机基础/其他）
 * - title: 已有 front-matter 的保留原标题；README 用父目录名；否则用文件名
 * - date:   已有 front-matter 的保留原 date；否则用文件 mtime
 *
 * 兼容 CRLF/LF 行尾（Windows 下 git core.autocrlf 会把工作区文件转成 CRLF）。
 * 幂等：已有 permalink + tags 的文件不会重复添加。
 *
 * 用法: node add-note-frontmatter.js
 */
const fs = require('fs');
const path = require('path');

const NOTES_ROOT = path.resolve(__dirname, '../../../../source/_posts/notes');

function pad(n) { return String(n).padStart(2, '0'); }
function mtimeOf(p) {
  const d = fs.statSync(p).mtime;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function walk(dir, base = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const item of items) {
    if (item.name.startsWith('.')) continue; // 跳过隐藏目录（.obsidian 等）
    const abs = path.join(dir, item.name);
    const rel = base ? `${base}/${item.name}` : item.name;
    if (item.isDirectory()) result.push(...walk(abs, rel));
    else if (item.name.endsWith('.md')) result.push({ rel, abs });
  }
  return result;
}

// 顶层分类：路径首段目录名；根级文件 → 其他
function topCategory(rel) {
  return rel.includes('/') ? rel.split('/')[0] : '其他';
}

function permalinkFor(rel) {
  return `/notes/${rel.replace(/\.md$/, '.html')}`;
}

// 标题：README 用父目录名（与索引页 linkLabel 一致）；否则用文件名
function titleFor(rel) {
  const base = path.basename(rel, '.md');
  if (/^README$/i.test(base) && rel.includes('/')) {
    return path.basename(path.dirname(rel));
  }
  return base;
}

function processFile({ rel, abs }) {
  const raw = fs.readFileSync(abs, 'utf8');
  const permalink = permalinkFor(rel);
  const tag = topCategory(rel);
  const hasFm = /^---\r?\n/.test(raw);

  let out;
  if (hasFm) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (m) {
      let fm = m[1];
      // title 为 README 时改用父目录名
      fm = fm.replace(/^title:\s*(.+)$/m, (t, val) => {
        const cur = val.trim().replace(/^["']|["']$/g, '');
        if (/^README$/i.test(cur) && rel.includes('/')) return `title: "${titleFor(rel)}"`;
        return t;
      });
      if (!/^permalink\s*:/m.test(fm)) fm += `\npermalink: ${permalink}`;
      if (!/^tags\s*:/m.test(fm)) fm += `\ntags: [${tag}]`;
      out = `---\n${fm}\n---\n${raw.slice(m[0].length)}`;
    } else {
      out = raw; // 无法解析，保持原样
    }
  } else {
    out = `---\ntitle: "${titleFor(rel)}"\ndate: ${mtimeOf(abs)}\npermalink: ${permalink}\ntags: [${tag}]\n---\n\n${raw}`;
  }

  if (out !== raw) {
    fs.writeFileSync(abs, out, 'utf8');
    return { rel, hasFm: hasFm ? 'existing' : 'new' };
  }
  return null;
}

const files = walk(NOTES_ROOT);
let newCount = 0, exCount = 0, noChange = 0;
for (const f of files) {
  const r = processFile(f);
  if (r) {
    if (r.hasFm === 'new') newCount++;
    else exCount++;
  } else {
    noChange++;
  }
}
console.log(`✅ 处理 ${files.length} 篇笔记：新插入 ${newCount}，更新 ${exCount}，无变化 ${noChange}`);
console.log(`   (根目录: ${NOTES_ROOT})`);
