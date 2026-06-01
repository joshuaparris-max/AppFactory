import { Check } from 'lucide-react';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export function Progress({
  value,
  max = 100,
  label,
  showPercent = true,
  variant = 'primary',
}: ProgressProps) {
  const percentage = (value / max) * 100;

  const variantStyles = {
    primary: 'bg-slate-900 dark:bg-slate-100',
    success: 'bg-green-500 dark:bg-green-400',
    warning: 'bg-yellow-500 dark:bg-yellow-400',
    danger: 'bg-red-500 dark:bg-red-400',
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          )}
          {showPercent && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${variantStyles[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface StepProgressProps {
  steps: { id: string; label: string; completed: boolean }[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step.completed || index < currentStep
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : index === currentStep
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-slate-900 dark:ring-slate-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                }`}
              >
                {step.completed ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step.completed || index < currentStep - 1
                      ? 'bg-slate-900 dark:bg-slate-100'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 text-center">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
