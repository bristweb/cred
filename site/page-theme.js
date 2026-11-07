// Standalone demo/setup pages opt into system appearance. The embedded widget itself follows its host.
// Keep "auto" on html: CSS media queries and the widget's existing media listener handle preference changes.
(function () {
  var theme = (new URLSearchParams(location.search).get('theme') || 'auto').toLowerCase();
  document.documentElement.setAttribute('data-theme', /^(light|dark)$/.test(theme) ? theme : 'auto');
})();
