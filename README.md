# 三国演义 时间线

> 以水墨为底，以时间为轴，重走一百二十回英雄路。

一个基于《三国演义》的交互式时间线网页——230+ 条事件、120+ 位人物，从黄巾起义到天下归晋，用现代白话讲完这段百年风云。

**在线预览**：[https://nilite-libiao.github.io/sango-timeline/](https://nilite-libiao.github.io/sango-timeline/)

---

## ✨ 功能亮点

- **单轨 → 三轨叙事**：赤壁之前一条线讲完天下大势，赤壁之后魏蜀吴三轨并行，跨势力事件严格时序对齐
- **因果链可视化**：每条事件标注「前情 · 后续」，点击即可沿因果链跳转浏览
- **现代白话叙事**：事件详情用现代人讲故事的方式重写，保留 1-2 句原文金句
- **人物志弹窗**：点击任意人物名弹出详情浮层，不打断当前阅读流
- **即时搜索**：人物志支持多字段模糊搜索 + 匹配高亮 + `/` 快捷键聚焦
- **水墨氛围**：东汉末年地图底图 + 宣纸纹理 + 远山剪影 + 漂浮墨点

## 🎨 视觉风格

- 深色墨褐底色，东汉水墨地图若隐若现
- 势力配色：曹魏 🔴 / 蜀汉 🟢 / 东吴 🔵
- 标题字体：马善政行书 | 正文字体：思源黑体
- 事件类型印章（战/政/交/殁/立/谋）

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion |
| 路由 | React Router v7 (HashRouter) |
| 部署 | GitHub Pages + GitHub Actions |

## 🚀 本地运行

```bash
git clone https://github.com/NiLite-Libiao/sango-timeline.git
cd sango-timeline
npm install
npm run dev
```

打开 `http://localhost:5173` 即可。

## 📦 构建

```bash
npm run build    # 输出到 dist/
npm run preview  # 本地预览构建产物
```

## 📐 项目结构

```
src/
├── data/
│   ├── events/          # 9 卷事件数据（230+ 条）
│   ├── characters/      # 人物数据（120+ 位）
│   ├── factions.ts      # 势力配色 & 时代划分
│   └── types.ts         # 类型定义
├── components/
│   ├── timeline/        # 时间线视图、事件卡片、详情面板
│   ├── characters/      # 人物志、人物卡片、弹窗
│   ├── layout/          # 页头、页脚
│   └── ui/              # 印章、水墨背景
└── scripts/             # 迁移脚本 & 叙事校验工具
```

## 📝 数据规范

- 事件 `detail` 字段：现代白话叙事 + 金句原文双层结构
- 事件 `summary` 字段：1-2 句口语化概述
- 事件 `prerequisites`：前置事件 ID，构成因果链
- 事件 `arc`：所属叙事线（如"赤壁之战""诸葛亮北伐"）
- 校验脚本 `scripts/validate-narrative.ts` 覆盖 6 项检查（悬空引用 / 断点 / 时序倒挂等）

## 📄 许可

本项目代码采用 MIT 许可。事件文本内容基于《三国演义》（公版）改写，仅供学习交流。

---

*烈火张天照云海，周郎于此破曹公。*
