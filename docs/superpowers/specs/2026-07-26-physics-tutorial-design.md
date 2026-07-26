# Ivy-League Freshman Physics — First-Semester Interactive Tutorial (Design Spec)

**Date:** 2026-07-26
**Status:** Approved by user
**Deliverable:** A bilingual (中文 + English terms) multi-page interactive HTML tutorial covering the complete first-semester physics-major curriculum at Ivy-League honors level.

## Decisions (locked)
| Dimension | Choice |
|---|---|
| Language | 双语对照 — Chinese prose, English technical terms inline, English key-terms boxes |
| Scope | 全科通吃 — Newtonian mechanics + analytical mechanics + special relativity + fluid mechanics + nonlinear/chaos + numerical methods |
| Format | Multi-page website with sidebar navigation + prev/next |
| Interactivity | Full — MathJax formulas + runnable JS/Canvas simulations with adjustable sliders |

## Pedagogy
Every chapter follows one fixed module order (consistent learning rhythm):
1. 🎯 **Learning Objectives** 学习目标 — what you can do after this chapter
2. 📖 **Core Concepts** 核心概念 — bilingual exposition + MathJax formulas + Key Terms box
3. 🔭 **Derivation** 推导 — rigorous derivation of key results
4. ✏️ **Worked Examples** 典型例题 — 3–5 problems with full step-by-step solutions
5. ⚠️ **Common Pitfalls** 常见误区 — error-prone points + physical-intuition corrections
6. 🧮 **Practice Problems** 练习题 — problems with collapsible hints + solutions (`<details>`)
7. 🎛️ **Interactive Simulation** 互动仿真 — adjustable-parameter canvas animation using `PhysicsSim`
8. 📝 **Summary & Key Formulas** 本章小结

## Curriculum (20 chapters + appendix)
**Part I — Newtonian Mechanics (`mechanics/`)**
1. 数学基础与矢量 — Math Foundations & Vectors
2. 运动学 — Kinematics
3. 牛顿定律与受力分析 — Newton's Laws & Free-Body Diagrams
4. 功、能量与守恒 — Work, Energy & Conservation
5. 动量与碰撞 — Momentum & Collisions
6. 转动动力学 — Rotational Dynamics
7. 静力学与平衡 — Statics & Equilibrium
8. 振动 — Oscillations
9. 引力 — Gravitation

**Part II — Analytical Mechanics (`analytical/`)**
10. 约束、广义坐标与虚功 — Constraints, Generalized Coordinates & Virtual Work
11. 拉格朗日方程与最小作用量 — Lagrange's Equations & Least Action
12. 守恒律与诺特定理 — Conservation Laws & Noether's Theorem
13. 哈密顿力学初步 — Hamiltonian Mechanics

**Part III — Special Relativity (`relativity/`)**
14. 相对论基础与洛伦兹变换 — Foundations & Lorentz Transformations
15. 时空几何与四维矢量 — Spacetime Geometry & Four-vectors
16. 相对论动力学 — Relativistic Dynamics

**Part IV — Fluid Mechanics (`fluids/`)**
17. 流体静力学 — Fluid Statics
18. 流体动力学 — Fluid Dynamics

**Part V — Advanced Topics (`advanced/`)**
19. 非线性动力学与混沌 — Nonlinear Dynamics & Chaos
20. 物理中的数值方法 — Numerical Methods in Physics

**Appendix (`appendix/`):** formula sheets, math review, physical constants, problem-solving strategies.

## Site architecture
```
physics-tutorial/   (repo root: /Users/wade/github/phi)
├── index.html                 # landing + full TOC
├── css/style.css              # shared academic theme, responsive, dark mode
├── js/
│   ├── math-config.js         # MathJax v3 config + loader
│   ├── nav.js                 # injects sidebar, prev/next, current highlight, dark toggle
│   └── sims/physics-sims.js   # shared simulation library (the engine)
├── mechanics/   01…09
├── analytical/  10…13
├── relativity/  14…16
├── fluids/      17…18
├── advanced/    19…20
└── appendix/    formulas, math-review, constants
```

## Design contract (what every page builds against)

### Math conventions
- Inline math: `\( ... \)`. Display math: `\[ ... \]`. Never bare `$`.
- MathJax v3 loaded/configured by `js/math-config.js` (tex-chtml, AMS, autoload, `\\( \\[ \\) \\]` delimiters, `physics` / no special packages to keep load light).

### Page template (every chapter)
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>第N章 · 标题 — 物理学教程</title>
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/math-config.js" defer></script>
  <script src="../js/sims/physics-sims.js" defer></script>
  <script src="../js/nav.js" defer></script>
</head>
<body data-chapter="N">
  <button class="sidebar-toggle" id="sidebarToggle" aria-label="目录">☰</button>
  <nav class="sidebar" id="sidebar"></nav>   <!-- nav.js injects the chapter list -->
  <main class="content">
    <header class="chapter-header">
      <p class="chapter-number">Chapter N · 第N章 · Part name</p>
      <h1>中文标题 <span class="en-title">English Title</span></h1>
    </header>

    <section class="objectives">…</section>
    <section class="core-concepts">… <div class="key-terms">Key Terms: …</div></section>
    <section class="derivation">…</section>
    <section class="examples">… <article class="example">…</article> …</section>
    <section class="pitfalls">…</section>
    <section class="practice">… <details class="problem"><summary>…</summary>…</details> …</section>
    <section class="simulation">
      <div class="sim-container">
        <canvas id="sim-N" width="600" height="400"></canvas>
        <div class="sim-controls" id="controls-N"></div>
      </div>
      <script>/* chapter sim using window.PhysicsSim; guard with DOMContentLoaded */</script>
    </section>
    <section class="summary">…</section>

    <nav class="chapter-nav">
      <a class="prev" href="prev.html">← 上一章</a>
      <a href="../index.html">目录 Index</a>
      <a class="next" href="next.html">下一章 →</a>
    </nav>
  </main>
</body>
</html>
```

### CSS class catalog (defined in style.css)
`.sidebar`, `.sidebar-toggle`, `.content`, `.chapter-header`, `.chapter-number`, `.en-title`,
`.objectives`, `.core-concepts`, `.key-terms` (callout), `.derivation`, `.formula` (display block),
`.examples`, `.example` (with `.example-statement`, `.example-solution`), `.pitfalls` (warning callout),
`.note` (info callout), `.practice`, `.problem`, `.simulation`, `.sim-container`, `.sim-controls`,
`.summary`, `.chapter-nav`, `.dark-toggle`, `[data-theme="dark"]` overrides, responsive breakpoints.

### Navigation contract (`nav.js`)
- Reads `document.body.dataset.chapter` to highlight current entry.
- Injects full chapter list (single source of truth) into `#sidebar`.
- Builds prev/next links for `.chapter-nav` from the same list.
- Mobile: `#sidebarToggle` toggles `.sidebar.open`.
- Dark mode toggle button injected into sidebar top; persists via `localStorage`.

### Simulation library contract (`PhysicsSim`, global on `window`)
```js
PhysicsSim.Vector                       // {x,y}; add,sub,scale,mag,normalize,dot,cross,angle,copy
PhysicsSim.integrate(deriv, state, t, dt, method)  // method: 'euler'|'verlet'|'rk4'; deriv(state,t)->dState
PhysicsSim.createSim(canvas, opts)      // opts:{setup(ctx),step(dt,t,state),draw(ctx,state),fps?}
                                        // returns controller {start,stop,reset,setTimeScale(s)}
PhysicsSim.makeControls(container, specs) // specs:[{type:'slider'|'toggle'|'button',key,label,min,max,step,value,...}]
                                        // returns {values, on(key,cb), get(key)}
PhysicsSim.drawArrow(ctx,x1,y1,x2,y2,color,label?)
PhysicsSim.drawGrid(ctx,{originX,originY,scale,color})
PhysicsSim.drawCircle(ctx,x,y,r,opts)
PhysicsSim.drawText(ctx,text,x,y,opts)
PhysicsSim.clear(ctx)
PhysicsSim.colors   // {primary,accent,accent2,grid,trace,bg,text,...} theme-aware
```
Chapter pages write a short inline `<script>` (inside `<section class="simulation">`, after the canvas) that calls `PhysicsSim.createSim(...)` + `PhysicsSim.makeControls(...)`, wrapped in `DOMContentLoaded` since libs are `defer`-loaded.

## Build plan
1. **Engine (me, now):** write `css/style.css`, `js/math-config.js`, `js/nav.js`, `js/sims/physics-sims.js`. Smoke-test.
2. **Content (workflow):** 20 chapter agents + 1 index agent + 2 appendix agents, all parallel against the contract above. Each writes its file via `Write` and returns a status manifest.
3. **Verify:** render in browser; adversarial correctness + integrity pass; fix.
