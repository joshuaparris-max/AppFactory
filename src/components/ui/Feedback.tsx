import React from 'react';

interface ChecklistProps {
  items: { id: string; label: string; completed: boolean }[];
  onChange?: (itemId: string, completed: boolean) => void;
}

export function Checklist({ items, onChange }: ChecklistProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={item.completed}
            onChange={(e) => onChange?.(item.id, e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 cursor-pointer"
          />
          <span
            className={`flex-1 text-sm ${
              item.completed
                ? 'text-slate-500 dark:text-slate-400 line-through'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}

interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full">
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[2px] ${
              activeTab === tab.id
                ? 'text-slate-900 dark:text-slate-100 border-slate-900 dark:border-slate-100'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}

export function Alert({
  variant = 'info',
  title,
  className = '',
  children,
  ...props
}: AlertProps) {
  const variantStyles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      <p className="text-sm">{children}</p>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
