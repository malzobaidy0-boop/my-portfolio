/* Side menu: open/close, Escape, outside click, focus handling. No dependencies. */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.getElementById('menu');
  var scrim = document.querySelector('.scrim');
  if (!toggle || !drawer || !scrim) return;
  var closeBtn = drawer.querySelector('.menu-close');
  var groupToggles = drawer.querySelectorAll('.group-toggle');

  function isOpen() { return drawer.classList.contains('is-open'); }

  function open() {
    drawer.classList.add('is-open');
    scrim.hidden = false;
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function close(returnFocus) {
    drawer.classList.remove('is-open');
    scrim.hidden = true;
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () { isOpen() ? close(true) : open(); });
  closeBtn.addEventListener('click', function () { close(true); });
  scrim.addEventListener('click', function () { close(true); });

  groupToggles.forEach(function (button) {
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  drawer.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var target = link.getAttribute('href');
    if (target && target.charAt(0) === '#') {
      var section = document.querySelector(target);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', target);
      }
    }
    close(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(true); return; }
    if (e.key !== 'Tab') return;
    var items = drawer.querySelectorAll('a[href], button');
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

(function () {
  var summaryButton = document.querySelector('.summary-button');
  var dialog = document.getElementById('summary-dialog');
  var closeButton = dialog && dialog.querySelector('.dialog-close');
  if (!summaryButton || !dialog || !closeButton || typeof dialog.showModal !== 'function') return;

  summaryButton.addEventListener('click', function () { dialog.showModal(); });
  closeButton.addEventListener('click', function () { dialog.close(); summaryButton.focus(); });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) { dialog.close(); summaryButton.focus(); }
  });
})();
