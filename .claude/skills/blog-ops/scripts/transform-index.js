#!/usr/bin/env node
/**
 * 从 source/notes/ 目录结构直接生成卡片式索引页 index.md
 * - 按顶层目录分组为分类，链接为真实存在的笔记
 * - 无死链、计数准确、兼容含括号/空格的中文路径
 */
const fs = require('fs');
const path = require('path');

const NOTES_DIR = path.resolve(__dirname, '../../../../source/notes');
const OUT_FILE = path.join(NOTES_DIR, 'index.md');

// 分类图标
const ICONS = {
  '八股': '📋',
  '图形学': '🎨',
  '游戏引擎': '🎮',
  '编程语言': '💻',
  '计算机基础': '🖥️',
  '其他': '📄',
  'default': '📁',
};

function listMarkdown(dir, prefix = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const item of items) {
    // 跳过隐藏目录(如 .obsidian) 与输出文件自身
    if (item.name.startsWith('.') || item.name === 'index.md') continue;
    const abs = path.join(dir, item.name);
    const rel = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.isDirectory()) {
      result.push(...listMarkdown(abs, rel));
    } else if (item.name.endsWith('.md')) {
      result.push(rel);
    }
  }
  return result;
}

// 计算链接显示名：README 用父文件夹名，其他用文件名
function linkLabel(relPath) {
  const parts = relPath.replace(/\.md$/, '').split('/');
  const name = parts[parts.length - 1];
  if (name.toLowerCase() === 'readme') {
    return parts.length > 1 ? parts[parts.length - 2] : 'README';
  }
  return name;
}

// 收集分类
const categories = [];
for (const entry of fs.readdirSync(NOTES_DIR, { withFileTypes: true })) {
  if (entry.name.startsWith('.') || entry.name === 'index.md') continue;
  if (entry.isDirectory()) {
    const notes = listMarkdown(path.join(NOTES_DIR, entry.name), entry.name);
    categories.push({ name: entry.name, notes });
  } else if (entry.name.endsWith('.md')) {
    categories.push({ name: '其他', notes: [entry.name] });
  }
}
// 稳定排序：其他放最后，其余按名称
categories.sort((a, b) => {
  if (a.name === '其他') return 1;
  if (b.name === '其他') return -1;
  return a.name.localeCompare(b.name, 'zh-CN');
});

// 生成 HTML
const total = categories.reduce((s, c) => s + c.notes.length, 0);
const parts = [];
parts.push('---');
parts.push('title: 学习笔记');
parts.push('layout: page');
parts.push('---');
parts.push('');
parts.push('<div class="notes-hub">');
parts.push('');
parts.push('  <header class="notes-hub-header">');
parts.push('    <h1>📚 学习笔记</h1>');
parts.push(`    <p class="notes-hub-subtitle">共 <strong>${total}</strong> 篇学习笔记，按主题分类整理</p>`);
parts.push('  </header>');
parts.push('');
parts.push('  <nav class="notes-hub-nav" aria-label="笔记分类导航">');
categories.forEach((c, idx) => {
  parts.push(`    <a class="notes-nav-chip" href="#notes-${idx}">${ICONS[c.name] || ICONS.default} ${c.name}<span class="notes-nav-count">${c.notes.length}</span></a>`);
});
parts.push('  </nav>');
parts.push('');

categories.forEach((c, idx) => {
  parts.push(`  <section class="notes-category" id="notes-${idx}">`);
  parts.push(`    <div class="notes-category-head">`);
  parts.push(`      <span class="notes-cat-icon">${ICONS[c.name] || ICONS.default}</span>`);
  parts.push(`      <h2 class="notes-cat-title">${c.name}</h2>`);
  parts.push(`      <span class="notes-cat-count">${c.notes.length} 篇</span>`);
  parts.push(`    </div>`);
  parts.push(`    <div class="notes-cat-body">`);
  for (const rel of c.notes.sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
    const href = rel.replace(/\.md$/, '.html');
    const label = linkLabel(rel);
    parts.push(`      <a class="note-chip" href="${href}" title="${rel.replace(/\.md$/, '')}">${label}</a>`);
  }
  parts.push(`    </div>`);
  parts.push(`  </section>`);
  parts.push('');
});

parts.push('</div>');
parts.push('');

fs.writeFileSync(OUT_FILE, parts.join('\n'), 'utf8');

console.log(`✅ 索引已从目录重新生成：${categories.length} 个分类，共 ${total} 条链接`);
for (const c of categories) {
  console.log(`  - ${c.name}: ${c.notes.length} 条`);
}
