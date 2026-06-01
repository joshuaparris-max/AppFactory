import { Badge } from '@/components/ui/Badge';
import { getPhaseLabel, riskLabels } from '@/lib/phases';
import type { BuildPhase, RiskLevel } from '@/lib/types';

export function PhaseBadge({ phase }: { phase: BuildPhase }) {
  return <Badge tone="blue">{getPhaseLabel(phase)}</Badge>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const tone = risk === 'high' ? 'red' : risk === 'medium' ? 'amber' : 'green';
  return <Badge tone={tone}>{riskLabels[risk]}</Badge>;
}
