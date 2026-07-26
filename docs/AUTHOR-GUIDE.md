# 作者指南 AUTHOR GUIDE — 章节页面统一规范

**所有章节子智能体必须先读本文件，再写章节。** 严格遵循以下规范，保证 20 章 + 附录风格、结构、技术实现完全一致。

仓库根目录：`/Users/wade/github/phi`。已建好的引擎文件（**直接引用，不要重写**）：
- `css/style.css` — 主题与全部样式类
- `js/math-config.js` — MathJax 配置与加载（`defer`）
- `js/sims/physics-sims.js` — 仿真引擎 `window.PhysicsSim`
- `js/nav.js` — 侧边栏注入、上下章导航、暗色模式（`defer`）

---

## 1. 每章固定的页面骨架

完整复制此骨架，只替换正文与仿真部分。注意：侧边栏由 `nav.js` 自动注入，你只需留空的 `<nav id="sidebar">` 与切换按钮；上下章链接也由 `nav.js` 根据 `data-chapter` 自动填充，留空 `.prev`/`.next` 即可。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>第N章 · 中文标题 — 物理学教程</title>
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/math-config.js" defer></script>
  <script src="../js/sims/physics-sims.js" defer></script>
  <script src="../js/nav.js" defer></script>
</head>
<body data-chapter="N">
  <button class="sidebar-toggle" id="sidebarToggle" aria-label="目录">☰</button>
  <nav class="sidebar" id="sidebar"></nav>
  <main class="content">
    <header class="chapter-header">
      <p class="chapter-number">Chapter N · 第N章 · 第X部分 英文Part</p>
      <h1>中文标题 <span class="en-title">English Title</span></h1>
    </header>

    <section class="objectives">  … 🎯 学习目标 …  </section>
    <section class="core-concepts"> … 📖 核心概念（含 .key-terms 与 .formula）… </section>
    <section class="derivation">   … 🔭 推导 … </section>
    <section class="examples">     … ✏️ 典型例题（多个 .example）… </section>
    <section class="pitfalls">     … ⚠️ 常见误区 … </section>
    <section class="practice">     … 🧮 练习题（多个 .problem，用 <details>）… </section>
    <section class="simulation">   … 🎛️ 互动仿真（canvas + 控件）… </section>
    <section class="summary">      … 📝 本章小结 … </section>

    <nav class="chapter-nav">
      <a class="prev" href="#"></a>
      <a href="../index.html">目录 Index</a>
      <a class="next" href="#"></a>
    </nav>
  </main>
</body>
</html>
```

> `data-chapter="N"` 必须填正确章号（1–20）。附录页用 `data-appendix="1"` 且骨架中 `<section>` 模块可酌情调整（公式表/数学回顾/常数表）。

## 2. 八大模块要求

1. **🎯 学习目标 Learning Objectives**：`<ul>` 列出 4–7 条「学完能做到……」，双语。
2. **📖 核心概念 Core Concepts**：中文讲解为主，专业术语**首次出现标注英文**，如「角动量 (angular momentum)」。每个重要公式用 `<div class="formula">\[ ... \]</div>`。每节末尾放一个 Key Terms 框：
   `<div class="key-terms">momentum (动量), impulse (冲量), …</div>`
3. **🔭 推导 Derivation**：至少 1 个关键结果的**严格推导**（如从牛顿定律导出能量守恒、从 $F=ma$ 到 $\tau=I\alpha$），分步骤、带公式。
4. **✏️ 典型例题 Worked Examples**：3–5 道，每道用 `<article class="example">`，结构：
   ```html
   <article class="example">
     <h4>例 N.1 题目简称</h4>
     <p class="example-statement">题干（带数值与单位）。</p>
     <div class="example-solution">
       <p class="step"><strong>解：</strong> ……</p>
       <p>…… <span class="ans">答案（带单位）</span></p>
     </div>
   </article>
   ```
   **必须有真实数值与单位、完整步骤**，不要跳步。
5. **⚠️ 常见误区 Common Pitfalls**：用 `<ul>` 列出 3–5 个高频错误与直觉纠偏。
6. **🧮 练习题 Practice Problems**：3–5 道，每道用可折叠的 `<details class="problem">`：
   ```html
   <details class="problem">
     <summary>题目……</summary>
     <div class="hint">提示……</div>
     <div class="solution">解答…… <span class="ans">答案</span></div>
   </details>
   ```
7. **🎛️ 互动仿真 Interactive Simulation**：见第 4 节，至少 1 个可调参数的真实仿真。
8. **📝 本章小结 Summary & Key Formulas**：要点 + 关键公式速查。

## 3. 数学公式规范（MathJax）

- 行内：`\( ... \)`；行间：`\[ ... \]`。**绝不**用裸 `$`。
- 已定义宏可直接用：`\vec{F}`（加粗矢量）、`\hat{n}`、`\dv{x}{t}`、`\pdv{f}{x}`、`\unit{m/s}`。
- 公式块用 `<div class="formula">\[ ... \]</div>` 而非裸 `\[ \]`，以获得样式。
- 单位用 `\,\mathrm{...}` 或 `\unit{...}`，例如 `\( g = 9.8\,\mathrm{m/s^2} \)`。

## 4. 交互仿真规范（核心，必须真实可运行）

引擎 API（`window.PhysicsSim`，DOM 就绪后可用；所有 `defer` 脚本在 `DOMContentLoaded` 前已加载）：

| API | 说明 |
|---|---|
| `PhysicsSim.Vector` | 2D 矢量类：`add/sub/scale/addScaled/mag/mag2/normalize/dot/cross/angle/copy`，`Vector.fromAngle(a,r)` |
| `PhysicsSim.integrate(deriv, state, t, dt, method)` | `method`:`'euler'`/`'rk4'`；`deriv(state,t)->导数数组`，`state` 为平坦数字数组 |
| `PhysicsSim.createSim(canvas, opts)` | `opts:{state()->对象, step(dt,t,state), draw(ctx,state,{t,canvas}), fps?}`；返回 `{start,stop,reset,setTimeScale,getState,getT}`。固定步长自动循环。 |
| `PhysicsSim.makeControls(container, specs)` | `specs` 每项 `{type:'slider'|'toggle'|'button', key, label, min,max,step,value}`；返回 `{values,on(key,cb),get,set}` |
| `PhysicsSim.drawArrow(ctx,x1,y1,x2,y2,color,label?)` | 画带箭头向量 |
| `PhysicsSim.drawGrid(ctx,{originX,originY,scale,step})` | 网格+坐标轴 |
| `PhysicsSim.drawCircle(ctx,x,y,r,{fill,stroke,lineWidth})` | 圆 |
| `PhysicsSim.drawText(ctx,text,x,y,{font,color,align,baseline})` | 文字 |
| `PhysicsSim.clear(ctx)` | 清屏（填充背景色） |
| `PhysicsSim.colors` | 主题色：`primary/accent/accent2/grid/trace/axis/bg/text`（getter，随暗色模式自动变化），`colors.palette[]` |

**标准写法模板**（把 `<canvas id>`、控件 key、step/draw 逻辑换成你章的物理）：

```html
<section class="simulation">
  <h2>🎛️ 互动仿真 Interactive Simulation</h2>
  <p class="sim-desc">一句话说明：拖动滑块改变 ……，观察 ……。</p>
  <div class="sim-container">
    <canvas id="sim-2" width="600" height="380"></canvas>
    <div class="sim-controls" id="controls-2"></div>
  </div>
  <script>
    window.addEventListener('DOMContentLoaded', function () {
      var PS = window.PhysicsSim;
      var canvas = document.getElementById('sim-2');
      var W = canvas.width, H = canvas.height;
      var params = { /* 控件初值 */ };
      var sim = PS.createSim(canvas, {
        state: function () { return { /* 重置态 */ }; },
        step: function (dt, t, s) {
          // 用 params.* 做物理更新；可用 PS.integrate 做 RK4，或直接半隐式 Euler
        },
        draw: function (ctx, s, env) {
          PS.clear(ctx);
          PS.drawGrid(ctx, { originX: 40, originY: H - 40, scale: 40, step: 1 });
          // 画轨迹、物体、矢量、文字…… 用 PS.colors.* 保持主题一致
        },
      });
      var ctl = PS.makeControls(document.getElementById('controls-2'), [
        { type: 'slider', key: 'v0', label: '初速度 v₀ (m/s)', min: 1, max: 40, step: 1, value: 20 },
        { type: 'slider', key: 'angle', label: '角度 θ (°)', min: 0, max: 90, step: 1, value: 45 },
        { type: 'button', key: 'reset', label: '↺ 重置 Reset' },
      ]);
      ctl.on('v0', function (v) { params.v0 = v; });
      ctl.on('angle', function (v) { params.angle = v; });
      ctl.on('reset', function () { sim.reset(); });
    });
  </script>
</section>
```

仿真要点：
- `<canvas id>` 必须唯一（用章号，如 `sim-2`）；`width/height` 直接写在 canvas 属性上。
- 物理参数化要**真实**（真实 g=9.8、真实公式），仿真要有教育意义，能看到该章核心现象。
- 控件至少 1 个 slider + 1 个 reset 按钮；复杂仿真再加 toggle。
- 画布要清晰：坐标轴、刻度、轨迹、物体、关键矢量（如速度、力）。
- **不要**在 `step` 里调用 `draw`；`createSim` 已自动每帧调用 `draw`。

## 5. 双语格式

- 正文中文；术语首次出现加英文括注「动量 (momentum)」。
- 标题中英对照：`<h1>中文 <span class="en-title">English</span></h1>`，章节小标题可中英并列。
- Key Terms 框以英文术语为主、中文括注。
- 例题/练习用中文叙述，公式与单位用标准记号。

## 6. 物理正确性（最高优先级）

- 所有公式、推导、数值必须**物理正确**。例题答案要算对（带单位量纲自洽）。
- 不要编造常数；常见值：$g=9.8\,\mathrm{m/s^2}$、$G=6.674\times10^{-11}\,\mathrm{N\,m^2/kg^2}$、$c=3.0\times10^8\,\mathrm{m/s}$、$m_e=9.11\times10^{-31}\,\mathrm{kg}$、$e=1.602\times10^{-19}\,\mathrm{C}$。
- 难度对标藤校荣誉课程（MIT 8.012 / Princeton 105 / Harvard 15a 级别）。

## 7. 完成后自检清单（写完文件后逐条核对）

- [ ] `data-chapter` 章号正确；`<nav class="sidebar" id="sidebar"></nav>` 与 `#sidebarToggle` 存在。
- [ ] 八大 section 全部存在且内容充实。
- [ ] 所有 MathJax 定界符成对（每个 `\(` 配 `\)`，每个 `\[` 配 `\]`）；无裸 `$`。
- [ ] 至少 3 道带数值与单位的例题；练习题用 `<details>`。
- [ ] 仿真 `<canvas>` id 唯一；脚本包在 `DOMContentLoaded`；引用 `window.PhysicsSim` 正确；包含 reset。
- [ ] 文件已用 Write 写到指定路径。

**最终用 Write 工具把完整 HTML 写到给定路径，并简短报告：写入路径、章名、含几个例题/练习/仿真、自检是否全过。**
