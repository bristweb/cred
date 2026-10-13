/* Old file name: loads assets/js/cred.js from the same place, with the same data-* options, at the same spot. */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var s = document.createElement('script');
  s.src = new URL('cred.js', me.src).href;
  for (var i = 0; i < me.attributes.length; i++) {
    var a = me.attributes[i];
    if (/^data-/.test(a.name)) s.setAttribute(a.name, a.value);
  }
  me.parentNode.insertBefore(s, me.nextSibling);
})();
