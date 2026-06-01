'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Progress } from './Progress';
import type { App } from '@/types';

interface ProjectCardProps {
  app: App;
  onOpen: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ app, onOpen, onDelete }: ProjectCardProps) {
  const statusConfig = {
    draft: { badge: 'warning', label: 'Draft' },
    'in-progress': { badge: 'info', label: 'In Progress' },
    completed: { badge: 'success', label: 'Completed' },
  };

  const status = statusConfig[app.status];

  return (
    <Card hoverable onClick={() => onOpen(app.id)} className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{app.name}</CardTitle>
            <CardDescription>{app.description}</CardDescription>
          </div>
          <Badge variant={status.badge as any}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <Progress value={app.progress} label="Progress" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {app.agents.slice(0, 3).map((agent) => (
              <Badge key={agent.id} variant="primary" size="sm">
                {agent.name}
              </Badge>
            ))}
            {app.agents.length > 3 && (
              <Badge variant="primary" size="sm">
                +{app.agents.length - 3} more
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Updated {new Date(app.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button size="sm" variant="ghost" onClick={() => onOpen(app.id)}>
          View Details
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(app.id);
            }}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface TaskBoardProps {
  agents: any[];
  onTaskUpdate?: (taskId: string, status: string) => void;
}

export function TaskBoard({ agents, onTaskUpdate }: TaskBoardProps) {
  const statuses = ['pending', 'in-progress', 'completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statuses.map((status) => (
        <div key={status} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 capitalize">
            {status.replace('-', ' ')}
          </h3>
          <div className="space-y-3">
            {agents.flatMap((agent) =>
              agent.tasks
                .filter((task: any) => task.status === status)
                .map((task: any) => (
                  <Card
                    key={task.id}
                    padding="sm"
                    className="cursor-move hover:shadow-md transition-shadow"
                    onClick={() => onTaskUpdate?.(task.id, status)}
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">
                          {agent.name}
                        </Badge>
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'danger'
                              : task.priority === 'medium'
                                ? 'warning'
                                : 'info'
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
            )}
            {!agents.some((agent) =>
              agent.tasks.some((task: any) => task.status === status)
            ) && (
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center py-8">
                No tasks yet
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
