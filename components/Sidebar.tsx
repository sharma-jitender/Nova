"use client";

const QUICK_PROBES = [
  "Explain dark matter",
  "Saturn's rings composition",
  "Next SpaceX launch",
  "How do black holes form?",
  "Mars colonization timeline",
];

interface SidebarProps {
  onProbeClick: (text: string) => void;
}

export default function Sidebar({ onProbeClick }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r border-[var(--border-glow)] glass-panel">
      <div className="p-4">
        <h2 className="font-orbitron font-bold text-xs uppercase tracking-wider text-[var(--text-dim)] mb-4">
          MISSION LOG
        </h2>
        <ul className="space-y-2 text-sm text-[var(--text-dim)]">
          <li className="px-3 py-1 rounded hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)] cursor-default">
            Session active
          </li>
        </ul>
      </div>

      <div className="p-4 flex-1">
        <h2 className="font-orbitron font-bold text-xs uppercase tracking-wider text-[var(--text-dim)] mb-3">
          QUICK PROBES
        </h2>
        <div className="space-y-2">
          {QUICK_PROBES.map((probe) => (
            <button
              key={probe}
              type="button"
              onClick={() => onProbeClick(probe)}
              className="w-full text-left px-3 py-2 rounded text-xs font-mono text-[var(--text-primary)] hover:bg-[var(--bg-panel)] hover:border-[var(--border-glow)] border border-transparent transition-colors"
            >
              {probe}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border-glow)]">
        <p className="text-[var(--text-dim)] text-xs font-mono flex items-center gap-1">
          NOVA v1.0 // CLASSIFIED
          <span className="inline-block w-2 h-4 bg-[var(--accent-cyan)] animate-pulse" />
        </p>
      </div>
    </aside>
  );
}
