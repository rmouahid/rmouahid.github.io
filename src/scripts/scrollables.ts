// Tables that scroll sideways on a narrow screen must be reachable from the keyboard (diagrams: see mermaid.ts).
const selector = '.prose table';

function update() {
  for (const element of document.querySelectorAll<HTMLElement>(selector)) {
    const scrolls = element.scrollWidth > element.clientWidth + 1;
    if (scrolls) {
      element.tabIndex = 0;
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', 'Table, scrolls horizontally');
        element.dataset.autoLabel = '';
      }
    } else {
      element.removeAttribute('tabindex');
      if (element.dataset.autoLabel !== undefined) {
        element.removeAttribute('aria-label');
        delete element.dataset.autoLabel;
      }
    }
  }
}

update();
let pending: number | undefined;
const schedule = () => {
  clearTimeout(pending);
  pending = window.setTimeout(update, 100);
};
window.addEventListener('resize', schedule);
