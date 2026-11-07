// Minimal collection entries for component tests (no content layer needed).
export function project(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    data: {
      title: `Project ${id}`,
      summary: `Summary of ${id}.`,
      tldr: ['Result one'],
      tags: ['LLM'],
      stack: ['Python'],
      featured: false,
      order: 100,
      repo: `https://github.com/rmouahid/${id}`,
      status: 'active' as const,
      date: new Date('2026-01-01'),
      ...overrides,
    },
  } as any;
}
