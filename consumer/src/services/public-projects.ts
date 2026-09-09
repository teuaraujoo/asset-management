import type {
  PublicProjectDetailsResponse,
  PublicProjectsResponse,
} from '../types/public-project'

const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export async function getPublicProjects(signal?: AbortSignal): Promise<PublicProjectsResponse> {
  const response = await fetch(`${apiUrl}/api/v1/public/projects`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os projetos.')
  }

  return response.json() as Promise<PublicProjectsResponse>
}

export async function getPublicProject(
  slug: string,
  signal?: AbortSignal,
): Promise<PublicProjectDetailsResponse> {
  const response = await fetch(`${apiUrl}/api/v1/public/projects/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    if (response.status === 404) throw new Error('Projeto não encontrado.')
    throw new Error('Não foi possível carregar o projeto.')
  }

  return response.json() as Promise<PublicProjectDetailsResponse>
}
