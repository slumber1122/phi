# 物理学教程 · Physics Tutorial

> **八学期 · 双语（中文 + 英文术语）· 可交互仿真** 的藤校物理本科级别完整课程。
> A full 8-semester, bilingual, interactive physics curriculum (honors undergrad level).

🌐 **在线浏览 / Live site:** <https://slumber1122.github.io/phi/>

---

## 这是什么 · What this is

**108+ 章 + 11 篇附录**，从经典力学到广义相对论、从电磁学到量子场论、从热统到等离子体与宇宙学。每章统一结构：

> 🎯 学习目标 → 📖 核心概念 → 🔭 推导 → ✏️ 典型例题 → ⚠️ 常见误区 → 🧮 练习题 → 🎛️ **可调参数交互仿真** → 📝 小结

**纯静态站点**（HTML + CSS + 原生 JavaScript），**无构建步骤**；MathJax 已本地化，**可离线运行**。所有路径为相对路径，子路径安全——直接用 GitHub Pages 即可托管。

## 内容总览 · Contents

**8 个学期 / 8 semesters**
1. 力学与现代物理 · Mechanics & Modern Physics
2. 电磁学 · Electromagnetism
3. 波动·光学·数学方法 · Waves, Optics & Math Methods
4. 热力学与统计物理 · Thermal & Statistical Physics
5. 量子力学 I + 高等经典力学 · Quantum I + Adv. Classical
6. 量子力学 II + 电动力学 · Quantum II + Electrodynamics
7. 凝聚态 + 核与粒子物理 · Condensed Matter + Nuclear/Particle
8. 广义相对论·天体·量子场论·等离子体 · GR · Astro · QFT · Plasma

**11 篇附录 / 11 appendices**
- 📖 参考：公式速查表 / 数学回顾 / 物理常数与单位
- 🔬 实验史：电子枪 / 双缝干涉的历史 / Stern–Gerlach / 迈克尔逊–莫雷
- 💡 光与视觉：光子的产生 / 我们如何看到颜色 / 形状与距离 / 偏振视觉

## 功能 · Features

- 🎛️ **每章可调参数交互仿真**（自研引擎 `js/sims/physics-sims.js`，RK4/Euler 积分 + 实时绘图）
- 🔎 **全文搜索**（侧边栏搜索框，或按 `/` 聚焦；索引在 `js/search-index.json`）
- 🌙 **深色模式**（localStorage 记忆）
- 📐 **MathJax 公式**（v3，tex-svg，**本地化**，离线可渲染）
- 🎨 统一「Observatory Atelier」主题（Space Grotesk + Newsreader，靛蓝/琥珀，方格纸签名）

## 本地运行 · Run locally

```bash
git clone https://github.com/slumber1122/phi.git
cd phi
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

> 直接双击 `index.html` 用 `file://` 也能看，但推荐起个本地服务器（搜索/MathJax 走 fetch 时更稳）。

## 维护 · Maintaining

- **改了章节正文后**，推送前重建搜索索引（否则线上搜索会滞后）：
  ```bash
  python3 tools/build-search-index.py
  ```
- 之后 `git push origin main`，**GitHub Pages 会自动重建并上线**（约 10–60 秒）。

## 技术栈 · Tech stack

静态 HTML / CSS / 原生 JS。无框架、无打包、无依赖。共享：

- `css/style.css` — 主题与全部样式
- `js/math-config.js` — MathJax 配置（加载本地 `js/vendor/mathjax/`）
- `js/sims/physics-sims.js` — 仿真引擎（Vector / integrate / createSim / makeControls）
- `js/nav.js` — 侧边栏、上下章导航、全文搜索、深色模式
- `tools/build-search-index.py` — 搜索索引构建脚本
