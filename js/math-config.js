/* MathJax v3 configuration + loader.
 * Loaded with `defer` on every page, BEFORE MathJax itself.
 * Defines inline \( ... \) and display \[ ... \] delimiters and a few
 * physics-friendly macros available across all chapters.
 */
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    processEscapes: true,
    tags: 'none',
    macros: {
      vec: ['\\mathbf{#1}', 1],
      // NOTE: do NOT redefine \hat — it is a built-in accent; redefining it
      // causes infinite recursion ("maximum macro substitution count exceeded").
      dv: ['\\frac{d#1}{d#2}', 2],
      pdv: ['\\frac{\\partial #1}{\\partial #2}', 2],
      unit: ['\\,\\mathrm{#1}', 1],
    },
  },
  svg: { fontCache: 'global' },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'canvas'],
  },
};

(function () {
  // Load MathJax from the LOCAL vendored copy (js/vendor/mathjax/tex-svg.js),
  // not a CDN — a slow/unreachable CDN (jsdelivr is erratic in CN) leaves math
  // stuck as raw \( ... \) until it finally returns. Self-hosted = fast + offline.
  // Resolve the path relative to THIS script (js/math-config.js) so it works at
  // any page depth (root index.html or a chapter subdir).
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^/]*$/, '') : ''; // → .../js/
  var s = document.createElement('script');
  s.src = base + 'vendor/mathjax/tex-svg.js';
  s.async = true;
  document.head.appendChild(s);
})();
