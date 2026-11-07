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
        const { svg } = await mermaid.render(`mermaid-${index}-${current}`, sources[index]);
        if (current !== run) return;
        host.innerHTML = svg;
      } catch {
        // Keep the source readable if the diagram does not parse.
        blocks[index].hidden = false;
        host.remove();
      }
    }
  };

  void draw();
  new MutationObserver(() => void draw()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}
