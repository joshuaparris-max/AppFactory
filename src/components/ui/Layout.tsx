'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Layout({ children, maxWidth = 'lg' }: LayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className={`mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`}>{children}</main>
    </div>
  );
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">{title}</h1>
          {subtitle && <p className="text-lg text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="mb-8">
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">{title}</h2>
          {description && <p className="text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Grid({ children, columns = 3 }: { children: React.ReactNode; columns?: number }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${colClasses[columns as keyof typeof colClasses]}`}>{children}</div>
  );
}
