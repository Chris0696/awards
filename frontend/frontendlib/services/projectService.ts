import { RequestOptions } from "@/app/common/types/common";
import {
  AuthProjectInput,
  ProjectInfo,
  ProjectInput,
} from "@/app/common/types/project";

export class ProjectService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorBody: any;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }

      const err = new Error(`Erreur API Next: ${res.status}`);
      (err as any).status = res.status;
      (err as any).body = errorBody;
      throw err;
    }

    return res.json() as Promise<T>;
  }
  getProjects(): Promise<ProjectInfo[]> {
    return this.request("/projects");
  }
  addNewProject(project: AuthProjectInput) {
    return this.request(`/projects`, {
      method: "POST",
      body: JSON.stringify(project),
    });
  }
  createProject(project: ProjectInput) {
    return this.request(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(project),
    });
  }
  updateProject(project: ProjectInput) {
    return this.request(`/projects`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
  }
}

export const projectService = new ProjectService();
