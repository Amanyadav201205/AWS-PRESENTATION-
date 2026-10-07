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

      {/* Domain Navigation Rows using semantic buttons with aria-current="page" */}
      <nav className="sidebar-list" aria-label="15 Architecture Modules" style={{ paddingBottom: 24 }}>
        {filtered.map((d) => {
          const globalIdx = domains.findIndex(item => item.id === d.id);
          const moduleNumber = globalIdx !== -1 ? globalIdx + 1 : d.number + 1;
          const isActive = d.id === selectedDomainId;
          const isDone = completedDomainIds.includes(d.id);

          return (
            <button
              key={d.id}
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
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            No matching modules
          </div>
        )}
      </nav>

      {/* Clean Keyboard Hint footer with generous padding */}
      <div className="sidebar-keyboard-hint">
        <span>Navigate modules</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>[← / →]</span>
      </div>
    </aside>
  );
};
