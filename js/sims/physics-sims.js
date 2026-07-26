/* physics-sims.js — shared simulation engine.
 * Global: window.PhysicsSim
 *   Vector, integrate(deriv,state,t,dt,method), createSim(canvas,opts),
 *   makeControls(container,specs), drawArrow/drawGrid/drawCircle/drawText/clear,
 *   colors (theme-aware getters + palette)
 *
 * Theme: reads CSS variables --sim-* on :root (light) and [data-theme=dark].
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ Vector */
  class Vector {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    set(x, y) { this.x = x; this.y = y; return this; }
    copy() { return new Vector(this.x, this.y); }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    scale(s) { this.x *= s; this.y *= s; return this; }
    addScaled(v, s) { this.x += v.x * s; this.y += v.y * s; return this; }
    mag() { return Math.hypot(this.x, this.y); }
    mag2() { return this.x * this.x + this.y * this.y; }
    normalize() { const m = this.mag() || 1; return this.scale(1 / m); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    cross(v) { return this.x * v.y - this.y * v.x; } // scalar z-component
    angle() { return Math.atan2(this.y, this.x); }
    static fromAngle(a, r = 1) { return new Vector(r * Math.cos(a), r * Math.sin(a)); }
  }

  /* -------------------------------------------------------------- Integrators */
  // deriv(state, t) -> array of derivatives, same length as state (flat array).
  function rk4(deriv, state, t, dt) {
    const k1 = deriv(state, t);
    const s2 = state.map((s, i) => s + 0.5 * dt * k1[i]);
    const k2 = deriv(s2, t + 0.5 * dt);
    const s3 = state.map((s, i) => s + 0.5 * dt * k2[i]);
    const k3 = deriv(s3, t + 0.5 * dt);
    const s4 = state.map((s, i) => s + dt * k3[i]);
    const k4 = deriv(s4, t + dt);
    return state.map((s, i) => s + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  function integrate(deriv, state, t, dt, method) {
    if (method === 'euler') {
      const d = deriv(state, t);
      return state.map((s, i) => s + dt * d[i]);
    }
    return rk4(deriv, state, t, dt); // 'rk4' (and 'verlet' aliases to rk4 generically)
  }

  /* ------------------------------------------------------------- Theme colors */
  function readVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const colors = {
    get primary() { return readVar('--sim-primary', '#2563eb'); },
    get accent() { return readVar('--sim-accent', '#dc2626'); },
    get accent2() { return readVar('--sim-accent2', '#16a34a'); },
    get grid() { return readVar('--sim-grid', '#cbd5e1'); },
    get trace() { return readVar('--sim-trace', '#7c3aed'); },
    get axis() { return readVar('--sim-axis', '#475569'); },
    get bg() { return readVar('--sim-bg', '#ffffff'); },
    get text() { return readVar('--sim-text', '#1e293b'); },
    palette: ['#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#ea580c', '#0891b2', '#ca8a04', '#be185d'],
  };

  /* ----------------------------------------------------------- Drawing helpers */
  function clear(ctx) {
    const c = ctx.canvas;
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  function drawGrid(ctx, o = {}) {
    const c = ctx.canvas;
    const ox = o.originX != null ? o.originX : c.width / 2;
    const oy = o.originY != null ? o.originY : c.height / 2;
    const scale = o.scale || 1;
    const step = Math.max(8, (o.step || 1) * scale);
    ctx.save();
    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    for (let x = ox % step; x < c.width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let x = ox % step - step; x > 0; x -= step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = oy % step; y < c.height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
    for (let y = oy % step - step; y > 0; y -= step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(c.width, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, c.height); ctx.stroke();
    ctx.restore();
  }
  function drawArrow(ctx, x1, y1, x2, y2, color, label) {
    ctx.save();
    ctx.strokeStyle = color || colors.primary;
    ctx.fillStyle = color || colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 9;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4));
    ctx.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
    if (label) {
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(label, x2 + 6, y2 - 6);
    }
    ctx.restore();
  }
  function drawCircle(ctx, x, y, r, o = {}) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lineWidth || 2; ctx.stroke(); }
    ctx.restore();
  }
  function drawText(ctx, text, x, y, o = {}) {
    ctx.save();
    ctx.font = o.font || '13px system-ui, sans-serif';
    ctx.fillStyle = o.color || colors.text;
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'alphabetic';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ---------------------------------------------------------------- createSim */
  function createSim(canvas, opts = {}) {
    const ctx = canvas.getContext('2d');
    const fps = opts.fps || 60;
    const frameDt = 1 / fps;
    let state = opts.state ? opts.state() : {};
    let t = 0;
    let rafId = null;
    let last = 0;
    let acc = 0;
    let timeScale = opts.timeScale != null ? opts.timeScale : 1;
    let running = true;

    if (opts.setup) opts.setup(ctx, state, { canvas });

    function frame(now) {
      if (!running) return;
      rafId = requestAnimationFrame(frame);
      if (!last) last = now;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1; // clamp after backgrounded tabs
      acc += dt * timeScale;
      let guard = 0;
      while (acc >= frameDt && guard < 8) {
        if (opts.step) opts.step(frameDt, t, state);
        t += frameDt;
        acc -= frameDt;
        guard++;
      }
      if (opts.draw) opts.draw(ctx, state, { t, canvas });
    }

    function start() { if (!running) { running = true; last = 0; rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }
    function reset() {
      state = opts.state ? opts.state() : {};
      t = 0; acc = 0; last = 0;
      if (opts.setup) opts.setup(ctx, state, { canvas });
      if (opts.draw) opts.draw(ctx, state, { t, canvas });
    }
    rafId = requestAnimationFrame(frame);
    return {
      start, stop, reset,
      setTimeScale: (s) => { timeScale = s; },
      getState: () => state,
      getT: () => t,
    };
  }

  /* ------------------------------------------------------------ makeControls */
  function makeControls(container, specs) {
    const values = {};
    const callbacks = {};
    container.innerHTML = '';
    container.classList.add('sim-controls-inner');
    specs.forEach((spec) => {
      values[spec.key] = spec.value;
      const wrap = document.createElement('label');
      wrap.className = 'ctrl ctrl-' + spec.type;
      if (spec.type === 'slider') {
        const lbl = document.createElement('span'); lbl.className = 'ctrl-label'; lbl.textContent = spec.label;
        const val = document.createElement('span'); val.className = 'ctrl-value'; val.textContent = fmt(spec.value, spec.step);
        const input = document.createElement('input');
        input.type = 'range'; input.min = spec.min; input.max = spec.max; input.step = spec.step; input.value = spec.value;
        input.addEventListener('input', () => {
          values[spec.key] = parseFloat(input.value);
          val.textContent = fmt(values[spec.key], spec.step);
          (callbacks[spec.key] || []).forEach((cb) => cb(values[spec.key]));
        });
        const top = document.createElement('div'); top.className = 'ctrl-top';
        top.appendChild(lbl); top.appendChild(val);
        wrap.appendChild(top); wrap.appendChild(input);
      } else if (spec.type === 'toggle') {
        const input = document.createElement('input');
        input.type = 'checkbox'; input.checked = !!spec.value;
        const lbl = document.createElement('span'); lbl.className = 'ctrl-label'; lbl.textContent = spec.label;
        input.addEventListener('change', () => {
          values[spec.key] = input.checked;
          (callbacks[spec.key] || []).forEach((cb) => cb(values[spec.key]));
        });
        wrap.appendChild(input); wrap.appendChild(lbl);
      } else if (spec.type === 'button') {
        wrap.classList.add('ctrl-button-wrap');
        const b = document.createElement('button'); b.type = 'button'; b.className = 'ctrl-button'; b.textContent = spec.label;
        b.addEventListener('click', () => (callbacks[spec.key] || []).forEach((cb) => cb()));
        wrap.appendChild(b);
      }
      container.appendChild(wrap);
    });
    return {
      values,
      on(key, cb) { (callbacks[key] = callbacks[key] || []).push(cb); return this; },
      get(key) { return values[key]; },
      set(key, v) { values[key] = v; return this; },
    };
  }
  function fmt(v, step) {
    if (step == null) return String(v);
    const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    return Number(v).toFixed(dec);
  }

  window.PhysicsSim = {
    Vector, integrate, createSim, makeControls,
    drawArrow, drawGrid, drawCircle, drawText, clear, colors,
  };
})();
