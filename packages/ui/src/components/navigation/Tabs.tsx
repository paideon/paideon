// packages/ui/src/components/navigation/Tabs.tsx
'use client';

import { clsx } from 'clsx';
import { useState } from 'react';

type TabVariant = 'line' | 'pills';
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: TabVariant;
  className?: string;
}

export function Tabs({
  tabs,
  defaultTabId,
  onChange,
  variant = 'line',
  className,
}: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId || tabs[0]?.id);

  const handleChange = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  const activeContent = tabs.find((tab) => tab.id === activeId)?.content;

  return (
    <div className={className}>
      <div
        className={clsx(
          'flex gap-1 border-b border-border-light',
          variant === 'pills' && 'border-b-0 gap-2 flex-wrap',
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleChange(tab.id)}
              className={clsx(
                'px-4 py-2 font-body text-label uppercase tracking-wide transition-all',
                variant === 'line' && [
                  'border-b-2 -mb-px',
                  isActive
                    ? 'border-gold-base text-gold-base'
                    : 'border-transparent text-text-muted hover:text-text-primary',
                ],
                variant === 'pills' && [
                  'rounded-full',
                  isActive
                    ? 'bg-green-base text-text-inverse'
                    : 'bg-surface-default text-text-muted hover:bg-surface-deep',
                ],
              )}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'ml-2 text-xs px-1.5 py-0.5 rounded-full',
                    isActive && variant === 'line'
                      ? 'bg-gold-pale text-gold-active'
                      : 'bg-surface-deep text-text-muted',
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-6">{activeContent}</div>
    </div>
  );
}
