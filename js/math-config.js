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
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
  s.async = true;
  document.head.appendChild(s);
})();
