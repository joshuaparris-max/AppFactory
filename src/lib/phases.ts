import type { BuildPhase, RiskLevel } from '@/lib/types';

export const buildPhases: Array<{ id: BuildPhase; label: string }> = [
  { id: 'idea', label: 'Idea capture' },
  { id: 'questions', label: 'Clarifying questions' },
  { id: 'spec', label: 'App spec' },
  { id: 'technical-plan', label: 'Technical plan' },
  { id: 'agent-split', label: 'Agent task split' },
  { id: 'review', label: 'Review checklist' },
];

export const riskLabels: Record<RiskLevel, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
};

export function getPhaseLabel(phase: BuildPhase) {
  return buildPhases.find(item => item.id === phase)?.label ?? phase;
}
