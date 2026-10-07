import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { DomainData } from '../types';
import { soundFX } from '../utils/soundEffects';

interface SidebarProps {
  domains: DomainData[];
  selectedDomainId: string;
  onSelectDomain: (id: string) => void;
  completedDomainIds: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  domains,
  selectedDomainId,
  onSelectDomain,
  completedDomainIds
}) => {
  const [query, setQuery] = useState('');

  const filtered = domains.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.subtitle.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="app-sidebar" aria-label="Architectural domains navigation">
      {/* Search Input */}
      <div className="sidebar-search">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: 10, pointerEvents: 'none' }} />
          <input
            type="text"
            className="sidebar-input"
            placeholder="Search framework modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter domains"
          />
        </div>
      </div>

      {/* Domain Navigation — shows section labels when not searching (category grouping aids
          presenter pacing: they can reference "we're in the Operations block" without counting).
          Searching shows a flat list without labels to keep scan results uncluttered. */}
      <nav className="sidebar-list" aria-label="15 Architecture Modules" style={{ paddingBottom: 8 }}>
        {filtered.length === 0 && (
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            No matching modules
          </div>
        )}
        {filtered.map((d, filteredIdx) => {
          const globalIdx = domains.findIndex(item => item.id === d.id);
          const moduleNumber = globalIdx !== -1 ? globalIdx + 1 : d.number + 1;
          const isActive = d.id === selectedDomainId;
          const isDone = completedDomainIds.includes(d.id);

          // Show a section label only when NOT searching and when the category
          // differs from the previous item in the filtered list.
          const prevCategory = filteredIdx > 0 ? filtered[filteredIdx - 1].category : null;
          const showSectionLabel = !query && d.category !== prevCategory;

          return (
            <React.Fragment key={d.id}>
              {showSectionLabel && (
                <div className="sidebar-section-label" aria-hidden="true">
                  {d.category}
                </div>
              )}
              <button
                type="button"
                className={`sidebar-row ${isActive ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  onSelectDomain(d.id);
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="row-index">{String(moduleNumber).padStart(2, '0')}</span>
                <span className="row-title">{d.title}</span>
                {isDone && !isActive && (
                  <Check size={12} color="var(--text-tertiary)" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer: progress + keyboard hint.
          Progress tells the presenter how many modules they have covered — useful for pacing.
          Keyboard hint is a persistent reminder visible while the sidebar is open. */}
      <div className="sidebar-footer">
        <div className="sidebar-progress-row">
          <span className="sidebar-progress-label">
            {completedDomainIds.length}/{domains.length}
          </span>
          <div className="sidebar-progress-track" title={`${completedDomainIds.length} of ${domains.length} modules visited`}>
            <div
              className="sidebar-progress-fill"
              style={{ width: `${Math.round((completedDomainIds.length / domains.length) * 100)}%` }}
            />
          </div>
        </div>
        <div className="sidebar-keyboard-hint">
          <span>Navigate modules</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>[← / →]</span>
        </div>
      </div>
    </aside>
  );
};
