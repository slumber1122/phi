/* nav.js — multi-semester sidebar.
 * Sidebar groups chapters by SEMESTER (collapsible <details>), with optional
 * PART sub-headers inside each semester. Prev/next + active-highlight are
 * URL-based (so chapter numbering can restart per semester with no collision).
 * Appendix/reference items (ref:true) appear in the sidebar but are excluded
 * from the prev/next reading chain.
 *
 * A page is in a subdirectory iff <body> has data-chapter or data-appendix
 * (so asset/sidebar link prefixes resolve correctly). index.html has neither.
 */
(function () {
  'use strict';

  var SEMESTERS = [
    {
      name: '第一学期 · 力学与现代物理 Mechanics',
      parts: [
        { name: '牛顿力学 Newtonian Mechanics', items: [
          { url: 'mechanics/01-vectors.html', title: '数学基础与矢量', en: 'Math Foundations & Vectors' },
          { url: 'mechanics/02-kinematics.html', title: '运动学', en: 'Kinematics' },
          { url: 'mechanics/03-newton-laws.html', title: '牛顿定律与受力分析', en: "Newton's Laws & FBDs" },
          { url: 'mechanics/04-work-energy.html', title: '功、能量与守恒', en: 'Work, Energy & Conservation' },
          { url: 'mechanics/05-momentum.html', title: '动量与碰撞', en: 'Momentum & Collisions' },
          { url: 'mechanics/06-rotation.html', title: '转动动力学', en: 'Rotational Dynamics' },
          { url: 'mechanics/07-statics.html', title: '静力学与平衡', en: 'Statics & Equilibrium' },
          { url: 'mechanics/08-oscillations.html', title: '振动', en: 'Oscillations' },
          { url: 'mechanics/09-gravitation.html', title: '引力', en: 'Gravitation' },
        ]},
        { name: '分析力学 Analytical Mechanics', items: [
          { url: 'analytical/10-constraints.html', title: '约束、广义坐标与虚功', en: 'Constraints & Virtual Work' },
          { url: 'analytical/11-lagrangian.html', title: '拉格朗日方程与最小作用量', en: "Lagrange's Equations" },
          { url: 'analytical/12-noether.html', title: '守恒律与诺特定理', en: "Noether's Theorem" },
          { url: 'analytical/13-hamiltonian.html', title: '哈密顿力学初步', en: 'Hamiltonian Mechanics' },
        ]},
        { name: '狭义相对论 Special Relativity', items: [
          { url: 'relativity/14-lorentz.html', title: '相对论基础与洛伦兹变换', en: 'Lorentz Transformations' },
          { url: 'relativity/15-spacetime.html', title: '时空几何与四维矢量', en: 'Spacetime & Four-vectors' },
          { url: 'relativity/16-relativistic-dynamics.html', title: '相对论动力学', en: 'Relativistic Dynamics' },
        ]},
        { name: '流体力学 Fluid Mechanics', items: [
          { url: 'fluids/17-statics.html', title: '流体静力学', en: 'Fluid Statics' },
          { url: 'fluids/18-dynamics.html', title: '流体动力学', en: 'Fluid Dynamics' },
        ]},
        { name: '进阶专题 Advanced Topics', items: [
          { url: 'advanced/19-chaos.html', title: '非线性动力学与混沌', en: 'Nonlinear Dynamics & Chaos' },
          { url: 'advanced/20-numerical.html', title: '物理中的数值方法', en: 'Numerical Methods' },
        ]},
        { name: '附录 Appendix', items: [
          { url: 'appendix/formulas.html', title: '公式速查表', en: 'Formula Sheets', ref: true },
          { url: 'appendix/math-review.html', title: '数学回顾', en: 'Math Review', ref: true },
          { url: 'appendix/constants.html', title: '物理常数与单位', en: 'Constants & Units', ref: true },
        ]},
      ],
    },
    {
      name: '第二学期 · 电磁学 Electromagnetism',
      parts: [
        { name: '静电学 Electrostatics', items: [
          { url: 'sem2/01-charge.html', title: '电荷与库仑定律', en: 'Charge & Coulomb\'s Law' },
          { url: 'sem2/02-field.html', title: '电场', en: 'Electric Field' },
          { url: 'sem2/03-gauss.html', title: '高斯定理', en: "Gauss's Law" },
          { url: 'sem2/04-potential.html', title: '电势', en: 'Electric Potential' },
          { url: 'sem2/05-conductors.html', title: '导体', en: 'Conductors' },
          { url: 'sem2/06-capacitance.html', title: '电容与电介质', en: 'Capacitance & Dielectrics' },
        ]},
        { name: '直流电路 DC Circuits', items: [
          { url: 'sem2/07-dc-circuits.html', title: '直流电路', en: 'DC Circuits' },
        ]},
        { name: '磁学与感应 Magnetism & Induction', items: [
          { url: 'sem2/08-magnetic-field.html', title: '磁场与洛伦兹力', en: 'Magnetic Field & Lorentz Force' },
          { url: 'sem2/09-biot-savart.html', title: '毕奥-萨伐尔与安培定律', en: "Biot-Savart & Ampère's Law" },
          { url: 'sem2/10-induction.html', title: '电磁感应', en: 'Electromagnetic Induction' },
          { url: 'sem2/11-inductance.html', title: '电感与暂态', en: 'Inductance & Transients' },
        ]},
        { name: '电磁场与电磁波 Fields & Waves', items: [
          { url: 'sem2/12-ac-circuits.html', title: '交流电路', en: 'AC Circuits' },
          { url: 'sem2/13-maxwell.html', title: '麦克斯韦方程组', en: "Maxwell's Equations" },
          { url: 'sem2/14-em-waves.html', title: '电磁波', en: 'Electromagnetic Waves' },
        ]},
      ],
    },
  ];

  function lastSeg(u) { return String(u).split('/').pop().split(/[?#]/)[0]; }

  function readingOrder() {
    var flat = [];
    SEMESTERS.forEach(function (sem) {
      sem.parts.forEach(function (part) {
        part.items.forEach(function (it) { if (!it.ref) flat.push(it); });
      });
    });
    return flat;
  }

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
  function here() { return lastSeg(location.pathname); }

  function buildSidebar() {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    var pfx = P();
    var cur = here();
    sb.innerHTML = '';

    var brand = document.createElement('div'); brand.className = 'sidebar-brand';
    brand.innerHTML = '<a class="home-link" href="' + pfx + 'index.html">⚛ 物理学 Physics</a>';
    sb.appendChild(brand);

    var dt = document.createElement('button'); dt.className = 'dark-toggle'; dt.type = 'button';
    dt.textContent = isDark() ? '☀ 浅色 Light' : '🌙 深色 Dark';
    dt.addEventListener('click', toggleDark);
    sb.appendChild(dt);

    SEMESTERS.forEach(function (sem) {
      var group = document.createElement('details');
      group.className = 'sem-group';
      var semHasActive = sem.parts.some(function (p) { return p.items.some(function (it) { return lastSeg(it.url) === cur; }); });
      group.open = semHasActive || cur === '' /* index: open first group below */;

      var sum = document.createElement('summary'); sum.className = 'sem-summary';
      sum.textContent = sem.name;
      group.appendChild(sum);

      sem.parts.forEach(function (part) {
        var ph = document.createElement('div'); ph.className = 'sidebar-part'; ph.textContent = part.name;
        group.appendChild(ph);
        part.items.forEach(function (it) {
          var a = document.createElement('a');
          a.className = 'sidebar-link' + (lastSeg(it.url) === cur ? ' active' : '') + (it.ref ? ' is-ref' : '');
          a.href = pfx + it.url;
          a.innerHTML = '<span class="sl-title">' + it.title + '<span class="sl-en">' + it.en + '</span></span>';
          group.appendChild(a);
        });
      });
      sb.appendChild(group);
    });

    // index page: open only the first semester
    if (cur === '') {
      var first = sb.querySelector('.sem-group');
      if (first) { sb.querySelectorAll('.sem-group').forEach(function (g) { g.open = false; }); first.open = true; }
    }

    var foot = document.createElement('div'); foot.className = 'sidebar-foot';
    foot.textContent = '大一物理 · 八学期';
    sb.appendChild(foot);
  }

  function wireChapterNav() {
    var flat = readingOrder();
    if (!flat.length) return;
    var idx = -1;
    for (var i = 0; i < flat.length; i++) { if (lastSeg(flat[i].url) === here()) { idx = i; break; } }
    if (idx < 0) return; // appendix/index: leave chapter-nav alone
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
        if (e.target.closest('a') && window.matchMedia('(max-width: 900px)').matches) sb.classList.remove('open');
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
