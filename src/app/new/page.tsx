'use client';

import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Lightbulb,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import { createClarifyingQuestions, createGeneratorOutput } from '../../../lib/generator';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/Button';
import { useProjectStore } from '@/context/project-store';

const steps = [
  { id: 'idea', label: 'Idea', title: 'Capture idea', icon: Lightbulb },
  { id: 'questions', label: 'Questions', title: 'Review questions', icon: ClipboardList },
  { id: 'answers', label: 'Answers', title: 'Answer or skip', icon: Users },
  { id: 'spec', label: 'Spec', title: 'Generated spec', icon: FileText },
  { id: 'agents', label: 'Agents', title: 'Agent split', icon: Workflow },
  { id: 'export', label: 'Export', title: 'Create project', icon: Sparkles },
] as const;

type StepId = (typeof steps)[number]['id'];

export default function NewAppPage() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [integrations, setIntegrations] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const mustHaveFeatures = useMemo(() => splitLines(features), [features]);
  const plannedIntegrations = useMemo(() => splitLines(integrations), [integrations]);
  const questions = useMemo(() => (idea.trim() ? createClarifyingQuestions(idea) : []), [idea]);
  const preview = useMemo(() => {
    if (!idea.trim()) {
      return null;
    }

    return createGeneratorOutput({
      idea,
      name: name.trim() || 'Untitled App',
      audience: audience.trim() || undefined,
      mustHaveFeatures,
      integrations: plannedIntegrations,
      authRequired: true,
    });
  }, [audience, idea, mustHaveFeatures, name, plannedIntegrations]);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLast) {
      goNext();
      return;
    }

    createAndOpenProject();
  }

  function goNext() {
    if (currentStep === 0 && (!name.trim() || !idea.trim())) {
      setError('Add a project name and idea before continuing.');
      return;
    }

    setError('');
    setCurrentStep(value => Math.min(value + 1, steps.length - 1));
  }

  function goBack() {
    setError('');
    setCurrentStep(value => Math.max(value - 1, 0));
  }

  function createAndOpenProject() {
    if (!name.trim() || !idea.trim()) {
      setCurrentStep(0);
      setError('Add a project name and idea before creating the project.');
      return;
    }

    const project = createProject({
      name,
      idea: answerSummary(idea, questions, questionAnswers),
      audience,
      mustHaveFeatures,
      integrations: plannedIntegrations,
    });
    router.push(`/projects/${project.id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow="New app wizard"
        title="Shape an idea into a build-ready plan."
        description="Move step by step from rough concept to clarifying questions, generated spec, agent split, scaffold plan, prompts, and review checklist. Everything stays local-first."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm h-fit">
          <ol className="space-y-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === currentStep;
              const complete = index < currentStep;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= currentStep || name.trim()) {
                        setCurrentStep(index);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                      active
                        ? 'bg-zinc-950 text-white'
                        : complete
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-md ${
                        active ? 'bg-white/15' : 'bg-zinc-100'
                      }`}
                    >
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span>
                      <span className="block font-semibold">{item.label}</span>
                      <span className="block text-xs opacity-75">{item.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-2 border-b border-zinc-200 pb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Step {currentStep + 1} of {steps.length}
            </p>
            <h2 className="text-2xl font-semibold text-zinc-950">{step.title}</h2>
          </div>

          {renderStep(step.id, {
            name,
            setName,
            idea,
            setIdea,
            audience,
            setAudience,
            features,
            setFeatures,
            integrations,
            setIntegrations,
            questions,
            questionAnswers,
            setQuestionAnswers,
            preview,
            mustHaveFeatures,
            plannedIntegrations,
          })}

          {error ? (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => (isFirst ? router.back() : goBack())}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFirst ? 'Cancel' : 'Back'}
            </button>
            <Button type="submit" className="flex items-center gap-2">
              {isLast ? 'Create project' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

function renderStep(
  step: StepId,
  state: {
    name: string;
    setName: (value: string) => void;
    idea: string;
    setIdea: (value: string) => void;
    audience: string;
    setAudience: (value: string) => void;
    features: string;
    setFeatures: (value: string) => void;
    integrations: string;
    setIntegrations: (value: string) => void;
    questions: ReturnType<typeof createClarifyingQuestions>;
    questionAnswers: Record<string, string>;
    setQuestionAnswers: (value: Record<string, string>) => void;
    preview: ReturnType<typeof createGeneratorOutput> | null;
    mustHaveFeatures: string[];
    plannedIntegrations: string[];
  }
) {
  if (step === 'idea') {
    return (
      <div className="grid gap-5">
        <Field label="Project name">
          <input
            value={state.name}
            onChange={event => state.setName(event.target.value)}
            placeholder="e.g., Client Portal Builder"
            className="h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
        </Field>
        <Field label="App idea">
          <textarea
            value={state.idea}
            onChange={event => state.setIdea(event.target.value)}
            placeholder="Describe the user, problem, workflow, constraints, and anything the app must not do yet."
            rows={8}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
        </Field>
        <Field label="Primary audience">
          <input
            value={state.audience}
            onChange={event => state.setAudience(event.target.value)}
            placeholder="e.g., small business owners, parents, learners, staff managers"
            className="h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
        </Field>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-zinc-600">
          These questions are generated from the idea. You can answer them in the next step or skip
          anything that is not known yet.
        </p>
        {state.questions.length ? (
          <div className="grid gap-3">
            {state.questions.map(question => (
              <div key={question.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-semibold text-zinc-950">{question.question}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{question.why}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyNote>Create an idea first and AppFactory will generate questions here.</EmptyNote>
        )}
      </div>
    );
  }

  if (step === 'answers') {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Must-have features">
            <textarea
              value={state.features}
              onChange={event => state.setFeatures(event.target.value)}
              placeholder="One feature per line. Leave blank to use template defaults."
              rows={6}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
          </Field>
          <Field label="Planned integrations">
            <textarea
              value={state.integrations}
              onChange={event => state.setIntegrations(event.target.value)}
              placeholder="One integration per line. These stay mocked until approved."
              rows={6}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
          </Field>
        </div>
        <div className="space-y-3">
          {state.questions.slice(0, 5).map(question => (
            <Field key={question.id} label={question.question}>
              <textarea
                value={state.questionAnswers[question.id] ?? ''}
                onChange={event =>
                  state.setQuestionAnswers({
                    ...state.questionAnswers,
                    [question.id]: event.target.value,
                  })
                }
                placeholder="Optional. Leave blank if this should stay an open question."
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-base leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              />
            </Field>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'spec') {
    return state.preview ? (
      <div className="grid gap-4 md:grid-cols-2">
        <PreviewBox title="Summary">{state.preview.spec.summary}</PreviewBox>
        <PreviewBox title="Audience">{state.preview.spec.primaryAudience}</PreviewBox>
        <PreviewBox title="Value proposition">{state.preview.spec.valueProposition}</PreviewBox>
        <PreviewBox title="Success metrics">
          <TextList items={state.preview.spec.successMetrics.slice(0, 5)} />
        </PreviewBox>
        <PreviewBox title="Core features" wide>
          <TextList items={state.preview.spec.coreFeatures.map(feature => feature.name)} />
        </PreviewBox>
      </div>
    ) : (
      <EmptyNote>Add an idea first to preview the generated spec.</EmptyNote>
    );
  }

  if (step === 'agents') {
    return state.preview ? (
      <div className="grid gap-4 md:grid-cols-2">
        {state.preview.tasks.map(task => (
          <div key={task.role} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-950">{task.role}</p>
            <p className="mt-1 break-all text-xs text-zinc-500">{task.branchName}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{task.mission}</p>
          </div>
        ))}
      </div>
    ) : (
      <EmptyNote>Add an idea first to preview the agent split.</EmptyNote>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PreviewBox title="Ready to create">
        {state.preview
          ? `${state.preview.spec.name} will be saved locally with spec, prompts, scaffold, risks, and checklist.`
          : 'Add an idea first to create a project.'}
      </PreviewBox>
      <PreviewBox title="Prompt pack">
        {state.preview
          ? `${state.preview.promptPack.prompts.length} copyable agent prompts`
          : 'No prompts yet'}
      </PreviewBox>
      <PreviewBox title="Scaffold plan">
        {state.preview
          ? `${state.preview.techPlan.scaffoldPlan.length} suggested files and ownership notes`
          : 'No scaffold yet'}
      </PreviewBox>
      <PreviewBox title="Safety">
        No live OpenAI, GitHub, or Vercel calls. Human approval remains required before deployment.
      </PreviewBox>
      <PreviewBox title="Captured features" wide>
        <TextList
          items={
            state.mustHaveFeatures.length
              ? state.mustHaveFeatures
              : ['Template defaults will be used for the selected app type.']
          }
        />
      </PreviewBox>
      <PreviewBox title="Planned integrations" wide>
        <TextList
          items={
            state.plannedIntegrations.length
              ? state.plannedIntegrations
              : ['No extra integrations requested yet.']
          }
        />
      </PreviewBox>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewBox({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={`rounded-md border border-zinc-200 bg-zinc-50 p-4 ${wide ? 'md:col-span-2' : ''}`}
    >
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-zinc-700">{children}</div>
    </section>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
      {children}
    </div>
  );
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean);
}

function answerSummary(
  idea: string,
  questions: ReturnType<typeof createClarifyingQuestions>,
  answers: Record<string, string>
) {
  const answered = questions
    .map(question => {
      const answer = answers[question.id]?.trim();
      return answer ? `${question.question} ${answer}` : '';
    })
    .filter(Boolean);

  if (answered.length === 0) {
    return idea;
  }

  return `${idea}\n\nClarifying notes:\n${answered.map(item => `- ${item}`).join('\n')}`;
}
