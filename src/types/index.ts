export interface App {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  agents: Agent[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

export interface BuildPhase {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  completed: boolean;
}

export interface Step {
  id: string;
  title: string;
  completed: boolean;
}
