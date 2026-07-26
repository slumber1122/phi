/* nav.js — injects the sidebar (single source of truth for the chapter list),
 * wires prev/next on chapter pages, handles mobile sidebar toggle + dark mode.
 * Loaded with `defer` on every page. A page opts into chapter prev/next by
 * setting <body data-chapter="N">. Sub-directory pages also set
 * <body data-appendix="1">. Index.html has neither (root level).
 */
(function () {
  'use strict';

  var PARTS = [
    {
      name: '第一部分 · 牛顿力学 Newtonian Mechanics',
      items: [
        { n: 1, url: 'mechanics/01-vectors.html', title: '数学基础与矢量', en: 'Math Foundations & Vectors' },
        { n: 2, url: 'mechanics/02-kinematics.html', title: '运动学', en: 'Kinematics' },
        { n: 3, url: 'mechanics/03-newton-laws.html', title: '牛顿定律与受力分析', en: "Newton's Laws & FBDs" },
        { n: 4, url: 'mechanics/04-work-energy.html', title: '功、能量与守恒', en: 'Work, Energy & Conservation' },
        { n: 5, url: 'mechanics/05-momentum.html', title: '动量与碰撞', en: 'Momentum & Collisions' },
        { n: 6, url: 'mechanics/06-rotation.html', title: '转动动力学', en: 'Rotational Dynamics' },
        { n: 7, url: 'mechanics/07-statics.html', title: '静力学与平衡', en: 'Statics & Equilibrium' },
        { n: 8, url: 'mechanics/08-oscillations.html', title: '振动', en: 'Oscillations' },
        { n: 9, url: 'mechanics/09-gravitation.html', title: '引力', en: 'Gravitation' },
      ],
    },
    {
      name: '第二部分 · 分析力学 Analytical Mechanics',
      items: [
        { n: 10, url: 'analytical/10-constraints.html', title: '约束、广义坐标与虚功', en: 'Constraints & Virtual Work' },
        { n: 11, url: 'analytical/11-lagrangian.html', title: '拉格朗日方程与最小作用量', en: "Lagrange's Equations" },
        { n: 12, url: 'analytical/12-noether.html', title: '守恒律与诺特定理', en: "Noether's Theorem" },
        { n: 13, url: 'analytical/13-hamiltonian.html', title: '哈密顿力学初步', en: 'Hamiltonian Mechanics' },
      ],
    },
    {
      name: '第三部分 · 狭义相对论 Special Relativity',
      items: [
        { n: 14, url: 'relativity/14-lorentz.html', title: '相对论基础与洛伦兹变换', en: 'Lorentz Transformations' },
        { n: 15, url: 'relativity/15-spacetime.html', title: '时空几何与四维矢量', en: 'Spacetime & Four-vectors' },
        { n: 16, url: 'relativity/16-relativistic-dynamics.html', title: '相对论动力学', en: 'Relativistic Dynamics' },
      ],
    },
    {
      name: '第四部分 · 流体力学 Fluid Mechanics',
      items: [
        { n: 17, url: 'fluids/17-statics.html', title: '流体静力学', en: 'Fluid Statics' },
        { n: 18, url: 'fluids/18-dynamics.html', title: '流体动力学', en: 'Fluid Dynamics' },
      ],
    },
    {
      name: '第五部分 · 进阶专题 Advanced Topics',
      items: [
        { n: 19, url: 'advanced/19-chaos.html', title: '非线性动力学与混沌', en: 'Nonlinear Dynamics & Chaos' },
        { n: 20, url: 'advanced/20-numerical.html', title: '物理中的数值方法', en: 'Numerical Methods' },
      ],
    },
    {
      name: '附录 Appendix',
      items: [
        { n: null, url: 'appendix/formulas.html', title: '公式速查表', en: 'Formula Sheets' },
        { n: null, url: 'appendix/math-review.html', title: '数学回顾', en: 'Math Review' },
        { n: null, url: 'appendix/constants.html', title: '物理常数与单位', en: 'Constants & Units' },
      ],
    },
  ];

  function allItems() {
    var a = [];
    PARTS.forEach(function (p) { p.items.forEach(function (it) { a.push(it); }); });
    return a;
  }
  function lastSeg(u) { return String(u).split('/').pop().split(/[?#]/)[0]; }

  document.addEventListener('DOMContentLoaded', function () {
    var theme = localStorage.getItem('physics-theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    buildSidebar();
    bindToggle();
    wireChapterNav();
  });

  function inSubdir() {
    return !!(document.body.dataset.chapter || document.body.dataset.appendix);
  }
  function P() { return inSubdir() ? '../' : ''; }

  function buildSidebar() {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    var here = lastSeg(location.pathname);
    var pfx = P();
    sb.innerHTML = '';

    var brand = document.createElement('div'); brand.className = 'sidebar-brand';
    brand.innerHTML = '<a class="home-link" href="' + pfx + 'index.html">⚛ 物理学 Physics</a>';
    sb.appendChild(brand);

    var dt = document.createElement('button'); dt.className = 'dark-toggle'; dt.type = 'button';
    dt.textContent = isDark() ? '☀ 浅色 Light' : '🌙 深色 Dark';
    dt.addEventListener('click', toggleDark);
    sb.appendChild(dt);

    PARTS.forEach(function (part) {
      var ph = document.createElement('div'); ph.className = 'sidebar-part'; ph.textContent = part.name;
      sb.appendChild(ph);
      part.items.forEach(function (it) {
        var a = document.createElement('a');
        a.className = 'sidebar-link' + (lastSeg(it.url) === here ? ' active' : '');
        a.href = pfx + it.url;
        var num = it.n != null ? ('<span class="sl-num">' + it.n + '</span>') : '<span class="sl-num sl-ast">★</span>';
        a.innerHTML = num + '<span class="sl-title">' + it.title + '<span class="sl-en">' + it.en + '</span></span>';
        sb.appendChild(a);
      });
    });

    var foot = document.createElement('div'); foot.className = 'sidebar-foot';
    foot.textContent = '大一物理 · 上学期';
    sb.appendChild(foot);
  }

  function wireChapterNav() {
    var n = document.body.dataset.chapter;
    if (!n) return;
    var flat = allItems().filter(function (it) { return it.n != null; });
    var idx = -1;
    for (var i = 0; i < flat.length; i++) { if (String(flat[i].n) === String(n)) { idx = i; break; } }
    if (idx < 0) return;
    var pfx = P();
    var prevEl = document.querySelector('.chapter-nav .prev');
    var nextEl = document.querySelector('.chapter-nav .next');
    if (idx > 0 && prevEl) {
      var pr = flat[idx - 1];
      prevEl.href = pfx + pr.url; prevEl.innerHTML = '← ' + pr.title;
      prevEl.classList.add('has-link');
    }
    if (idx < flat.length - 1 && nextEl) {
      var nx = flat[idx + 1];
      nextEl.href = pfx + nx.url; nextEl.innerHTML = nx.title + ' →';
      nextEl.classList.add('has-link');
    }
  }

  function bindToggle() {
    var btn = document.getElementById('sidebarToggle');
    var sb = document.getElementById('sidebar');
    if (btn && sb) {
      btn.addEventListener('click', function () { sb.classList.toggle('open'); });
      sb.addEventListener('click', function (e) {
        if (e.target.closest('a') && window.matchMedia('(max-width: 900px)').matches) {
          sb.classList.remove('open');
        }
      });
    }
  }

  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function toggleDark() {
    var next = isDark() ? 'light' : 'dark';
    if (next === 'light') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('physics-theme', next);
    var dt = document.querySelector('.dark-toggle');
    if (dt) dt.textContent = isDark() ? '☀ 浅色 Light' : '🌙 深色 Dark';
  }
})();
