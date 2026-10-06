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

      {/* Domain Navigation Rows */}
      <nav className="sidebar-list">
        {filtered.map((d) => {
          const isActive = d.id === selectedDomainId;
          const isDone = completedDomainIds.includes(d.id);

          return (
            <div
              key={d.id}
              className={`sidebar-row ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                onSelectDomain(d.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  soundFX.playClick();
                  onSelectDomain(d.id);
                }
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="row-index">{d.number}</span>
              <span className="row-title">{d.title}</span>
              {isDone && !isActive && (
                <Check size={12} color="var(--text-tertiary)" />
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            No matching domains
          </div>
        )}
      </nav>

      {/* Keyboard Hint footer */}
      <div className="sidebar-keyboard-hint">
        <span>Navigate</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>[← / →]</span>
      </div>
    </aside>
  );
};
