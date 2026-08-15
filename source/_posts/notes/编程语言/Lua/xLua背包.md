---
title: "xLua背包"
date: 2026-08-08 18:04:25
permalink: /notes/编程语言/Lua/xLua背包.html
tags: [编程语言]
---

# Lua背包

## Lua开发步骤

1. 为常用 C# 类创建 Lua 端的简化引用
2. 初始化数据
3. 面板基类
4. 具体面板

## Lua开发具体过程

### 为常用 C# 类创建 Lua 端的简化引用

```lua
--Unity相关的
GameObject = CS.UnityEngine.GameObject
Resources = CS.UnityEngine.Resources
Transform = CS.UnityEngine.Transform
RectTransform = CS.UnityEngine.RectTransform
TextAsset = CS.UnityEngine.TextAsset
--图集对象类
SpriteAtlas = CS.UnityEngine.U2D.SpriteAtlas
Vector3 = CS.UnityEngine.Vector3
Vector2 = CS.UnityEngine.Vector2
--UI相关
UI = CS.UnityEngine.UI
Image = UI.Image
Text = UI.Text
Button = UI.Button
Toggle = UI.Toggle
ScrollRect = UI.ScrollRect
UIBehaviour = CS.UnityEngine.EventSystems.UIBehaviour
--Canvas
Canvas = GameObject.Find("Canvas").transform
--自己写的C#脚本
--直接得到AB包资源管理器的 单例对象
ABMgr = CS.ABMgr.GetInstance()
```

### 初始化数据

#### Lua读取Json表

```lua
-- 将Json数据读取到Lua的表中存储
-- 从AB包中加载Json数据
local txt = ABMge:LoadRes("json", "ItemData", typeof(TextAsset))
print(txt)
-- 解析Json
local itemList = Json.decode(txt.text)

-- 将数据转存到Lua表中，键为ID 值为道具信息
ItemData = {}
for _, value in pairs(itemList) do
    ItemData[value.id] = value
end
```

#### 准备玩家数据

```lua
PlayerData = {}

PlayerData.equips = {}
PlayerData.items = {}
PlayerData.gems = {}

function PlayerData:Init()
    table.insert(self.equips, {id = 1, num = 1})
    table.insert(self.equips, {id = 2, num = 1})

    table.insert(self.items, {id = 3, num = 50})
    table.insert(self.items, {id = 4, num = 20})

    table.insert(self.gems, {id = 5, num = 99})
    table.insert(self.gems, {id = 6, num = 88})
end
```

### 面板基类

```lua
-- 利用面向对象
Object:subClass("BasePanel")

BasePanel.panelObj = nil
-- 相当于模拟一个字典 键为 控件名 值为控件本身
BasePanel.controls = {}
-- 事件监听标识
BasePanel.isInitEvent = false

function BasePanel:Init(name)
    if self.panelObj == nil then
        -- 公共的实例化对象的方法
        self.panelObj = ABMgr:LoadRes("ui", name, typeof(GameObject))
        self.panelObj.transform:SetParent(Canvas, false)
        -- GetComponentsInChildren
        -- 找到所有UI控件 存起来
        print(self.panelObj)
        local allControls = self.panelObj:GetComponentsInChildren(typeof(UIBehaviour))
        -- 如果存入一些对于我们来说没用UI控件 
        -- 为了避免 找各种无用控件 我们定一个规则 拼面板时 控件命名一定按规范来
        -- Button btn名字
        -- Toggle tog名字
        -- Image img名字
        -- ScrollRect sv名字
        for i = 0, allControls.Length - 1 do
            local controlName = allControls[i].name
            -- 按照名字的规则 去找控件 必须满足命名规则 才存起来
            if string.find(controlName, "btn") ~= nil or string.find(controlName, "tog") ~= nil or
                string.find(controlName, "img") ~= nil or string.find(controlName, "sv") ~= nil or
                string.find(controlName, "txt") ~= nil then
                -- 为了让我们在得的时候 能够 确定得的控件类型 所以我们需要存储类型
                -- 利用反射 Type 得到 控件的类名 
                local typeName = allControls[i]:GetType().Name
                -- 避免出现一个对象上 挂在多个UI控件 出现覆盖的问题 
                -- 都会被存到一个容器中 相当于像列表数组的形式
                -- 最终存储形式 
                -- { btnRole = { Image = 控件, Button = 控件 },
                --  togItem = { Toggle = 控件} }
                if self.controls[controlName] ~= nil then
                    -- 通过自定义索引的形式 去加一个新的 “成员变量”
                    self.controls[controlName][typeName] = allControls[i]
                else
                    self.controls[controlName] = {
                        [typeName] = allControls[i]
                    }
                end
            end
        end
    end
end

-- 得到控件 根据 控件依附对象的名字 和 控件的类型字符串名字 Button Image Toggle
function BasePanel:GetControl(name, typeName)
    if self.controls[name] ~= nil then
        local sameNameControls = self.controls[name]
        if sameNameControls[typeName] ~= nil then
            return sameNameControls[typeName]
        end
    end
    return nil
end

function BasePanel:ShowMe(name)
    self:Init(name)
    self.panelObj:SetActive(true)
end

function BasePanel:HideMe()
    self.panelObj:SetActive(false)
end
```

