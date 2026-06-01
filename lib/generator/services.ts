import type { ServiceResult } from './types';

export interface GitHubBranchRequest {
  repository: string;
  baseBranch: string;
  branchName: string;
}

export interface PullRequestRequest {
  repository: string;
  title: string;
  body: string;
  headBranch: string;
  baseBranch: string;
  draft: boolean;
}

export interface GitHubService {
  createBranch(request: GitHubBranchRequest): Promise<ServiceResult<{ branchName: string }>>;
  openPullRequest(
    request: PullRequestRequest
  ): Promise<ServiceResult<{ url: string; draft: boolean }>>;
  getRepositoryStatus(
    repository: string
  ): Promise<ServiceResult<{ repository: string; defaultBranch: string }>>;
}

export interface DeploymentRequest {
  projectName: string;
  branchName: string;
  environment: 'preview' | 'production';
  humanApproved: boolean;
}

export interface VercelService {
  createPreviewDeployment(request: DeploymentRequest): Promise<ServiceResult<{ url: string }>>;
  getDeploymentStatus(
    deploymentId: string
  ): Promise<ServiceResult<{ deploymentId: string; status: 'mocked' }>>;
  promoteProductionDeployment(
    request: DeploymentRequest
  ): Promise<ServiceResult<{ promoted: boolean }>>;
}

export interface AICompletionRequest {
  prompt: string;
  system?: string;
  temperature?: number;
}

export interface AIService {
  isEnabled(): boolean;
  complete(request: AICompletionRequest): Promise<ServiceResult<{ text: string }>>;
  generateStructured<T>(request: AICompletionRequest, fallback: T): Promise<ServiceResult<T>>;
}

export class MockGitHubService implements GitHubService {
  async createBranch(request: GitHubBranchRequest): Promise<ServiceResult<{ branchName: string }>> {
    return {
      ok: true,
      mode: 'mock',
      message: `Mock GitHub branch creation skipped for ${request.repository}.`,
      data: { branchName: request.branchName },
    };
  }

  async openPullRequest(
    request: PullRequestRequest
  ): Promise<ServiceResult<{ url: string; draft: boolean }>> {
    return {
      ok: true,
      mode: 'mock',
      message: `Mock pull request creation skipped for ${request.repository}.`,
      data: {
        url: `https://example.invalid/${request.repository}/pull/mock-${encodeURIComponent(request.headBranch)}`,
        draft: request.draft,
      },
    };
  }

  async getRepositoryStatus(
    repository: string
  ): Promise<ServiceResult<{ repository: string; defaultBranch: string }>> {
    return {
      ok: true,
      mode: 'mock',
      message: `Mock repository status returned for ${repository}.`,
      data: { repository, defaultBranch: 'main' },
    };
  }
}

export class MockVercelService implements VercelService {
  async createPreviewDeployment(
    request: DeploymentRequest
  ): Promise<ServiceResult<{ url: string }>> {
    return {
      ok: true,
      mode: 'mock',
      message: `Mock ${request.environment} deployment skipped for ${request.projectName}.`,
      data: { url: `https://example.invalid/${request.projectName}/${request.branchName}` },
    };
  }

  async getDeploymentStatus(
    deploymentId: string
  ): Promise<ServiceResult<{ deploymentId: string; status: 'mocked' }>> {
    return {
      ok: true,
      mode: 'mock',
      message: 'Mock deployment status returned.',
      data: { deploymentId, status: 'mocked' },
    };
  }

  async promoteProductionDeployment(
    request: DeploymentRequest
  ): Promise<ServiceResult<{ promoted: boolean }>> {
    if (!request.humanApproved) {
      return {
        ok: false,
        mode: 'mock',
        message: 'Production promotion blocked: human approval is required.',
        data: { promoted: false },
      };
    }

    return {
      ok: true,
      mode: 'mock',
      message: `Mock production promotion skipped for ${request.projectName}.`,
      data: { promoted: false },
    };
  }
}

export class MockAIService implements AIService {
  constructor(private readonly enabled = false) {}

  isEnabled(): boolean {
    return this.enabled;
  }

  async complete(request: AICompletionRequest): Promise<ServiceResult<{ text: string }>> {
    return {
      ok: this.enabled,
      mode: 'mock',
      message: this.enabled
        ? 'Mock AI completion returned. No live provider was called.'
        : 'AI completion disabled by default. No live provider was called.',
      data: {
        text: this.enabled
          ? `Mock AI response for: ${request.prompt.slice(0, 120)}`
          : 'AI disabled. Use deterministic generator functions or enable a future live adapter explicitly.',
      },
    };
  }

  async generateStructured<T>(
    request: AICompletionRequest,
    fallback: T
  ): Promise<ServiceResult<T>> {
    return {
      ok: this.enabled,
      mode: 'mock',
      message: this.enabled
        ? `Mock structured AI response returned for: ${request.prompt.slice(0, 80)}`
        : 'Structured AI generation disabled by default. Fallback returned.',
      data: fallback,
    };
  }
}

export function createMockServices() {
  return {
    github: new MockGitHubService(),
    vercel: new MockVercelService(),
    ai: new MockAIService(false),
  };
}
