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
    {
      name: '第三学期 · 波动·光学·数学方法 Waves, Optics & Math Methods',
      parts: [
        { name: '机械波与声 Mechanical Waves & Sound', items: [
          { url: 'sem3/01-waves.html', title: '波动基础', en: 'Wave Basics' },
          { url: 'sem3/02-string-sound.html', title: '弦上的波与声波', en: 'String & Sound Waves' },
          { url: 'sem3/03-superposition.html', title: '叠加·干涉·驻波', en: 'Superposition & Standing Waves' },
          { url: 'sem3/04-doppler.html', title: '多普勒效应', en: 'Doppler Effect' },
          { url: 'sem3/05-fourier.html', title: '傅里叶分析', en: 'Fourier Analysis' },
        ]},
        { name: '光学 Optics', items: [
          { url: 'sem3/06-geometric.html', title: '几何光学', en: 'Geometric Optics' },
          { url: 'sem3/07-lenses.html', title: '面镜与透镜', en: 'Mirrors & Lenses' },
          { url: 'sem3/08-instruments.html', title: '光学仪器', en: 'Optical Instruments' },
          { url: 'sem3/09-interference.html', title: '波动光学·干涉', en: 'Interference' },
          { url: 'sem3/10-diffraction.html', title: '衍射', en: 'Diffraction' },
          { url: 'sem3/11-polarization.html', title: '偏振', en: 'Polarization' },
        ]},
        { name: '数学方法 Math Methods', items: [
          { url: 'sem3/12-linear-algebra.html', title: '线性代数', en: 'Linear Algebra' },
          { url: 'sem3/13-ode-special.html', title: '微分方程与特殊函数', en: 'ODEs & Special Functions' },
          { url: 'sem3/14-complex-pde.html', title: '复变函数与偏微分方程', en: 'Complex Analysis & PDEs' },
        ]},
      ],
    },
    {
      name: '第四学期 · 热力学与统计物理 Thermal & Statistical Physics',
      parts: [
        { name: '热力学 Thermodynamics', items: [
          { url: 'sem4/01-temperature.html', title: '温度与热平衡', en: 'Temperature & Equilibrium' },
          { url: 'sem4/02-heat.html', title: '热量·比热·潜热', en: 'Heat & Calorimetry' },
          { url: 'sem4/03-ideal-gas.html', title: '理想气体与气体动理论', en: 'Ideal Gas & Kinetic Theory' },
          { url: 'sem4/04-maxwell.html', title: '麦克斯韦-玻尔兹曼分布', en: 'Maxwell-Boltzmann Distribution' },
          { url: 'sem4/05-first-law.html', title: '热力学第一定律与过程', en: 'First Law & Processes' },
          { url: 'sem4/06-engines.html', title: '热机·卡诺·第二定律', en: 'Engines, Carnot & 2nd Law' },
          { url: 'sem4/07-entropy.html', title: '熵·热力学势·相变', en: 'Entropy, Potentials & Phases' },
        ]},
        { name: '统计力学 Statistical Mechanics', items: [
          { url: 'sem4/08-microstates.html', title: '微观态·玻尔兹曼熵', en: 'Microstates & Boltzmann Entropy' },
          { url: 'sem4/09-canonical.html', title: '正则系综·配分函数', en: 'Canonical Ensemble & Z' },
          { url: 'sem4/10-grand.html', title: '巨正则系综·化学势', en: 'Grand Canonical & μ' },
          { url: 'sem4/11-quantum-stats.html', title: '量子统计', en: 'Quantum Statistics' },
          { url: 'sem4/12-fluctuations.html', title: '涨落与输运现象', en: 'Fluctuations & Transport' },
        ]},
      ],
    },
    {
      name: '第五学期 · 量子力学 I + 高等经典力学 Quantum I + Adv. Classical',
      parts: [
        { name: '量子力学 I Quantum Mechanics I', items: [
          { url: 'sem5/01-origins.html', title: '量子力学起源', en: 'Origins of QM' },
          { url: 'sem5/02-schrodinger.html', title: '波函数与薛定谔方程', en: 'Wave Function & Schrödinger Eq.' },
          { url: 'sem5/03-1d.html', title: '一维势场问题', en: '1D Potential Problems' },
          { url: 'sem5/04-formalism.html', title: '量子力学形式体系', en: 'QM Formalism' },
          { url: 'sem5/05-angular.html', title: '角动量', en: 'Angular Momentum' },
          { url: 'sem5/06-hydrogen.html', title: '氢原子', en: 'Hydrogen Atom' },
          { url: 'sem5/07-spin.html', title: '自旋', en: 'Spin' },
        ]},
        { name: '高等经典力学 Advanced Classical Mechanics', items: [
          { url: 'sem5/08-lagrangian-adv.html', title: '拉格朗日力学（深化）', en: 'Lagrangian (Advanced)' },
          { url: 'sem5/09-hamilton-canonical.html', title: '哈密顿方程与正则变换', en: "Hamilton's Eqs & Canonical Transforms" },
          { url: 'sem5/10-rigid-body.html', title: '刚体动力学', en: 'Rigid Body Dynamics' },
          { url: 'sem5/11-hamilton-jacobi.html', title: '哈密顿-雅可比方程', en: 'Hamilton-Jacobi' },
          { url: 'sem5/12-perturbation.html', title: '经典微扰与 KAM', en: 'Classical Perturbation & KAM' },
        ]},
      ],
    },
    {
      name: '第六学期 · 量子力学 II + 电动力学 Quantum II + Electrodynamics',
      parts: [
        { name: '量子力学 II Quantum Mechanics II', items: [
          { url: 'sem6/01-identical.html', title: '全同粒子与多体', en: 'Identical Particles & Many-Body' },
          { url: 'sem6/02-perturbation.html', title: '不含时微扰论', en: 'Time-Independent Perturbation' },
          { url: 'sem6/03-transitions.html', title: '含时微扰与跃迁', en: 'Transitions & Golden Rule' },
          { url: 'sem6/04-scattering.html', title: '散射理论', en: 'Scattering Theory' },
          { url: 'sem6/05-atoms-molecules.html', title: '原子与分子物理', en: 'Atomic & Molecular Physics' },
        ]},
        { name: '电动力学 Electrodynamics', items: [
          { url: 'sem6/06-multipoles.html', title: '静电学与多极展开', en: 'Electrostatics & Multipoles' },
          { url: 'sem6/07-magnetostatics.html', title: '磁学与矢势', en: 'Magnetostatics & Vector Potential' },
          { url: 'sem6/08-maxwell-covariant.html', title: '麦克斯韦方程（协变与能量）', en: "Maxwell (Covariant) & Energy" },
          { url: 'sem6/09-waves-radiation.html', title: '电磁波与辐射', en: 'EM Waves & Radiation' },
          { url: 'sem6/10-relativistic-em.html', title: '相对论电动力学', en: 'Relativistic Electrodynamics' },
          { url: 'sem6/11-fields-matter.html', title: '电磁介质', en: 'Fields in Matter' },
          { url: 'sem6/12-charge-motion.html', title: '带电粒子在电磁场中的运动', en: 'Charge Motion in Fields' },
        ]},
      ],
    },
    {
      name: '第七学期 · 凝聚态 + 核与粒子物理 Condensed Matter + Nuclear/Particle',
      parts: [
        { name: '凝聚态物理 Condensed Matter', items: [
          { url: 'sem7/01-crystals.html', title: '晶体结构与倒格子', en: 'Crystals & Reciprocal Lattice' },
          { url: 'sem7/02-phonons.html', title: '晶格振动与声子', en: 'Lattice Vibrations & Phonons' },
          { url: 'sem7/03-bands.html', title: '自由电子与能带', en: 'Free Electrons & Energy Bands' },
          { url: 'sem7/04-semiconductors.html', title: '半导体', en: 'Semiconductors' },
          { url: 'sem7/05-superconductivity.html', title: '超导电性', en: 'Superconductivity' },
          { url: 'sem7/06-magnetism.html', title: '固体磁性', en: 'Magnetism in Solids' },
        ]},
        { name: '核与粒子物理 Nuclear & Particle Physics', items: [
          { url: 'sem7/07-nuclear-structure.html', title: '核结构', en: 'Nuclear Structure' },
          { url: 'sem7/08-radioactivity.html', title: '放射性与核衰变', en: 'Radioactivity & Decay' },
          { url: 'sem7/09-reactions-fission.html', title: '核反应·裂变·聚变', en: 'Reactions, Fission & Fusion' },
          { url: 'sem7/10-standard-model.html', title: '粒子物理与标准模型', en: 'Standard Model' },
          { url: 'sem7/11-symmetries.html', title: '对称性与守恒律', en: 'Symmetries & Conservation' },
          { url: 'sem7/12-cosmology.html', title: '粒子天体物理与宇宙学', en: 'Particle Astro & Cosmology' },
        ]},
      ],
    },
    {
      name: '第八学期 · 广义相对论·天体·量子场论·等离子体 GR · Astro · QFT · Plasma',
      parts: [
        { name: '广义相对论 General Relativity', items: [
          { url: 'sem8/01-equivalence.html', title: '等效原理与时空几何', en: 'Equivalence & Spacetime Geometry' },
          { url: 'sem8/02-einstein-bh.html', title: '爱因斯坦方程与黑洞', en: "Einstein's Eqs & Black Holes" },
          { url: 'sem8/03-gr-waves-cosmo.html', title: '引力波与相对论宇宙学', en: 'GWs & Relativistic Cosmology' },
        ]},
        { name: '天体物理 Astrophysics', items: [
          { url: 'sem8/04-stars.html', title: '恒星结构与演化', en: 'Stellar Structure & Evolution' },
          { url: 'sem8/05-compact-objects.html', title: '致密天体与高能天体物理', en: 'Compact Objects & High-Energy Astro' },
        ]},
        { name: '量子场论 Quantum Field Theory', items: [
          { url: 'sem8/06-qft-basics.html', title: '量子场论基础', en: 'QFT Foundations' },
          { url: 'sem8/07-gauge-renorm.html', title: '规范场论与重整化', en: 'Gauge Theories & Renormalization' },
          { url: 'sem8/08-electroweak-bsm.html', title: '电弱统一与超出标准模型', en: 'Electroweak & BSM' },
        ]},
        { name: '等离子体物理 Plasma Physics', items: [
          { url: 'sem8/09-plasma-basics.html', title: '等离子体物理基础', en: 'Plasma Physics Basics' },
          { url: 'sem8/10-plasma-fusion.html', title: '等离子体波与聚变', en: 'Plasma Waves & Fusion' },
        ]},
        { name: '前沿专题 Frontiers', items: [
          { url: 'sem8/11-unification.html', title: '统一理论与量子引力', en: 'Unification & Quantum Gravity' },
          { url: 'sem8/12-frontiers.html', title: '当代物理学前沿', en: 'Frontiers of Physics' },
        ]},
      ],
    },
    {
      name: '附录 Appendix',
      parts: [
        { name: '', items: [
          { url: 'appendix/formulas.html', title: '公式速查表', en: 'Formula Sheets', ref: true },
          { url: 'appendix/math-review.html', title: '数学回顾', en: 'Math Review', ref: true },
          { url: 'appendix/constants.html', title: '物理常数与单位', en: 'Constants & Units', ref: true },
          { url: 'appendix/electron-gun.html', title: '电子枪（实验装置）', en: 'The Electron Gun', ref: true },
          { url: 'appendix/double-slit.html', title: '双缝干涉的历史', en: 'The Double-Slit: A History', ref: true },
          { url: 'appendix/stern-gerlach.html', title: 'Stern–Gerlach 实验', en: 'Stern–Gerlach Experiment', ref: true },
          { url: 'appendix/michelson-morley.html', title: '迈克尔逊–莫雷实验', en: 'Michelson–Morley Experiment', ref: true },
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

    mountSearch(sb);

    SEMESTERS.forEach(function (sem) {
      var group = document.createElement('details');
      group.className = 'sem-group';
      var semHasActive = sem.parts.some(function (p) { return p.items.some(function (it) { return lastSeg(it.url) === cur; }); });
      group.open = semHasActive || cur === '' /* index: open first group below */;

      var sum = document.createElement('summary'); sum.className = 'sem-summary';
      sum.textContent = sem.name;
      group.appendChild(sum);

      sem.parts.forEach(function (part) {
        if (part.name) {
          var ph = document.createElement('div'); ph.className = 'sidebar-part'; ph.textContent = part.name;
          group.appendChild(ph);
        }
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
    foot.textContent = '大学物理 · 八学期';
    sb.appendChild(foot);
  }

  // ============================================================ full-text search
  // Client-side substring search over js/search-index.json (built by
  // tools/build-search-index.py). Substring matching needs no tokenizer, so it
  // matches Chinese terms and English phrases equally well. The index is
  // fetched lazily on first keystroke and cached.
  function jsBase() {
    var s = document.querySelector('script[src$="nav.js"]');
    return s ? s.src.replace(/[^/]*$/, '') : '';
  }
  var _IDX = null, _IDX_BUSY = false, _IDX_WAIT = [];
  function loadIndex(cb) {
    if (_IDX) { cb(_IDX); return; }
    _IDX_WAIT.push(cb);
    if (_IDX_BUSY) return;
    _IDX_BUSY = true;
    fetch(jsBase() + 'search-index.json', { cache: 'force-cache' })
      .then(function (r) { if (!r.ok) throw new Error('index'); return r.json(); })
      .then(function (d) { _IDX = d; _IDX_WAIT.forEach(function (w) { w(d); }); _IDX_WAIT = []; })
      .catch(function () { _IDX_BUSY = false; _IDX_WAIT = []; });
  }
  function escHtml(s) {
    return String(s).replace(/[&<>]/g, function (c) { return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'; });
  }
  function escReg(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var out = [];
    for (var i = 0; i < _IDX.length; i++) {
      var e = _IDX[i], t = e.t.toLowerCase(), c = e.c.toLowerCase();
      var ti = t.indexOf(q), ci = c.indexOf(q);
      if (ti < 0 && ci < 0) continue;
      var occ = 0, from = 0, p;
      while ((p = c.indexOf(q, from)) >= 0) { occ++; from = p + q.length; if (occ > 200) break; }
      var score = (ti >= 0 ? 120 : 0) + (ti === 0 ? 60 : 0) +
                  (ci >= 0 ? Math.max(0, 30 - ci / 300) : 0) + Math.min(occ, 40);
      out.push({ e: e, ci: ci, score: score });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 12);
  }
  function snippet(c, q, ci) {
    var start = ci >= 0 ? Math.max(0, ci - 36) : 0;
    var end = Math.min(c.length, start + 110);
    var s = (start > 0 ? '…' : '') + c.slice(start, end) + (end < c.length ? '…' : '');
    return escHtml(s).replace(new RegExp(escReg(escHtml(q)), 'gi'), '<mark>$&</mark>');
  }
  function mountSearch(sb) {
    var box = document.createElement('div'); box.className = 'search';
    box.innerHTML =
      '<input id="siteSearch" type="search" placeholder="🔎 搜索全站内容…" autocomplete="off" aria-label="搜索 Search">' +
      '<div id="searchResults" class="search-results" hidden></div>';
    sb.appendChild(box);
    var input = box.querySelector('#siteSearch');
    var res = box.querySelector('#searchResults');
    var timer = null;
    function render(q) {
      if (!q.trim()) { res.hidden = true; res.innerHTML = ''; return; }
      var hits = runSearch(q);
      if (!hits.length) {
        res.hidden = false;
        res.innerHTML = '<div class="sr-empty">未找到匹配 No matches for “' + escHtml(q) + '”</div>';
        return;
      }
      var pfx = P();
      res.hidden = false;
      res.innerHTML = hits.map(function (h) {
        var snip = h.ci >= 0 ? snippet(h.e.c, q, h.ci) : '';
        return '<a class="sr-item" href="' + pfx + h.e.u + '">' +
          '<span class="sr-title">' + escHtml(h.e.t) + '</span>' +
          (snip ? '<span class="sr-snip">' + snip + '</span>' : '') +
          '</a>';
      }).join('');
    }
    input.addEventListener('input', function () {
      var v = input.value;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!_IDX) loadIndex(function () { render(input.value); });
        else render(v);
      }, 120);
    });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { input.value = ''; res.hidden = true; input.blur(); }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/i.test(document.activeElement.tagName)) {
        ev.preventDefault(); input.focus();
      }
    });
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
