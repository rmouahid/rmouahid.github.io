// Tables and diagrams that scroll sideways on a narrow screen must be reachable from the keyboard.
const selector = '.prose table, .prose .mermaid-diagram';

function update() {
  for (const element of document.querySelectorAll<HTMLElement>(selector)) {
    const scrolls = element.scrollWidth > element.clientWidth + 1;
    if (scrolls) {
      element.tabIndex = 0;
      element.setAttribute('role', element.tagName === 'TABLE' ? 'table' : 'img');
      if (!element.hasAttribute('aria-label')) {
        const label = element.tagName === 'TABLE' ? 'Table, scrolls horizontally' : 'Diagram, scrolls horizontally';
        element.setAttribute('aria-label', label);
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
// Diagrams are drawn asynchronously; re-check once they land.
new MutationObserver(schedule).observe(document.querySelector('.prose') ?? document.body, {
  childList: true,
  subtree: true,
});
