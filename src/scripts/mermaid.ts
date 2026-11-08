// Draws ```mermaid blocks of a case study with the active Noir/Paper colors, and redraws on a mode change.
// Mermaid is only downloaded on pages that contain a diagram.
// Astro leaves excluded languages unhighlighted: <pre><code class="language-mermaid">.
const blocks = [...document.querySelectorAll<HTMLElement>('pre > code.language-mermaid')].map(
  code => code.parentElement as HTMLElement,
);

if (blocks.length > 0) {
  const sources = blocks.map(block => block.textContent ?? '');
  const hosts = blocks.map(block => {
    const host = document.createElement('figure');
    host.className = 'mermaid-diagram';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Architecture diagram');
    block.after(host);
    block.hidden = true;
    return host;
  });

  // A left-to-right flowchart wider than the column would be scaled down until unreadable: draw it top-down.
  const topDown = (source: string) =>
    source.replace(/^(\s*(?:flowchart|graph)\s+)(LR|RL)\b/m, '$1TD').replace(/^(\s*direction\s+)(LR|RL)\b/gm, '$1TB');
  const viewBoxWidth = (svg: string) => Number(svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/)?.[1] ?? 0);
  const natural = (host: HTMLElement) => host.querySelector('svg')?.viewBox.baseVal?.width ?? 0;
  const available = (host: HTMLElement) => host.clientWidth - 32;

  // Never shrink a diagram below 70 % of its natural size; the figure scrolls sideways instead.
  const fit = (host: HTMLElement) => {
    const svg = host.querySelector('svg');
    const width = natural(host);
    if (!svg || !width) return;
    svg.style.maxWidth = 'none';
    svg.style.width = `${Math.min(width, Math.max(available(host), width * 0.7))}px`;
  };

  const color = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let run = 0;

  const draw = async () => {
    const current = ++run;
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: 'JetBrains Mono Variable, ui-monospace, monospace',
      themeVariables: {
        background: color('--tn-surface-base'),
        primaryColor: color('--tn-surface-elevated'),
        primaryTextColor: color('--tn-text-primary'),
        primaryBorderColor: color('--tn-accent-primary'),
        secondaryColor: color('--tn-surface-raised'),
        tertiaryColor: color('--tn-surface-raised'),
        lineColor: color('--tn-text-muted'),
        textColor: color('--tn-text-primary'),
        clusterBkg: color('--tn-surface-raised'),
        clusterBorder: color('--tn-surface-outline'),
        edgeLabelBackground: color('--tn-surface-base'),
        fontSize: '13px',
      },
    });
    for (const [index, host] of hosts.entries()) {
      try {
        let { svg } = await mermaid.render(`mermaid-${index}-${current}`, sources[index]);
        if (viewBoxWidth(svg) * 0.6 > available(host)) {
          ({ svg } = await mermaid.render(`mermaid-${index}-${current}-td`, topDown(sources[index])));
        }
        if (current !== run) return;
        host.innerHTML = svg;
        fit(host);
        host.dataset.ready = '';
      } catch {
        // Keep the source readable if the diagram does not parse.
        blocks[index].hidden = false;
        host.remove();
      }
    }
  };

  void draw();
  let resized: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resized);
    resized = window.setTimeout(() => void draw(), 250);
  });
  new MutationObserver(() => void draw()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}
