---
title: "Hotfix"
date: 2026-08-08 18:04:25
permalink: /notes/游戏引擎/Unity/热更新/Hotfix.html
tags: [游戏引擎]
---

# 热补丁Hotfix

## xLua

### 步骤

1. 在Assets同级目录导入xLua文件中的Tools文件
2. 给需要热补丁的类加特性`[Hotfix]`
3. 给项目加宏`HOTFIX_ENABLE`
4. 生成代码
5. hotfix注入
6. 若修改了热补丁类，需要重新从第四步执行

