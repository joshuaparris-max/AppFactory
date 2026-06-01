'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';
import { StepProgress } from './ui/Progress';
import { Section } from './ui/Layout';

interface WizardStep {
  id: string;
  label: string;
  title: string;
  description?: string;
}

interface AppWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AppWizard({ onSubmit, onCancel }: AppWizardProps) {
  const steps: WizardStep[] = [
    {
      id: 'idea',
      label: 'Capture the idea',
      title: 'What app are you building?',
      description: 'Describe your app idea in simple terms',
    },
    {
      id: 'clarify',
      label: 'Clarify the app',
      title: 'Define the core features',
      description: 'What are the key features your app needs?',
    },
    {
      id: 'spec',
      label: 'Generate the spec',
      title: 'Review your build spec',
      description: 'We\'ll generate a structured specification',
    },
    {
      id: 'agents',
      label: 'Split tasks',
      title: 'Assign to agents',
      description: 'Which AI agents should work on this?',
    },
    {
      id: 'review',
      label: 'Review',
      title: 'Final review',
      description: 'Check everything before deploying',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    idea: '',
    features: '',
    spec: '',
    agents: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0 && !formData.name.trim()) {
      newErrors.name = 'App name is required';
    }
    if (step === 0 && !formData.idea.trim()) {
      newErrors.idea = 'App idea is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          {currentStepData.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {currentStepData.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <StepProgress
              steps={steps.map((s, idx) => ({
                id: s.id,
                label: s.label,
                completed: idx < currentStep,
              }))}
              currentStep={currentStep}
            />
          </div>

          <Section>
            {currentStep === 0 && (
              <div className="space-y-4">
                <Input
                  label="App Name"
                  placeholder="e.g., Customer Dashboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
                <Textarea
                  label="Your App Idea"
                  placeholder="Describe what your app does, who uses it, and why it's needed..."
                  value={formData.idea}
                  onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                  error={errors.idea}
                  rows={5}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <Textarea
                  label="Core Features"
                  placeholder="List the main features your app needs (one per line)..."
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={5}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Based on your input, here's your build specification:
                </p>
                <div className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {formData.spec || 'Your specification will appear here...'}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {['UI Developer', 'Backend Engineer', 'DevOps Engineer', 'QA Tester'].map(
                    (agent) => (
                      <label
                        key={agent}
                        className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={formData.agents.includes(agent)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                agents: [...formData.agents, agent],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                agents: formData.agents.filter((a) => a !== agent),
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">{agent}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">✓ Ready to create</p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                    Your app <strong>{formData.name}</strong> is configured and ready to build!
                  </p>
                </div>
              </div>
            )}
          </Section>
        </CardContent>

        <CardFooter className="justify-between border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create App
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
