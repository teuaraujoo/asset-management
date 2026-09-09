import { useCallback, useEffect, useState } from 'react'
import { getPublicProjects } from '../services/public-projects'
import type { PublicProject } from '../types/public-project'

type RequestStatus = 'loading' | 'success' | 'error'

export function usePublicProjects() {
  const [projects, setProjects] = useState<PublicProject[]>([])
  const [status, setStatus] = useState<RequestStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  const reload = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProjects() {
      setStatus('loading')
      setError(null)

      try {
        const response = await getPublicProjects(controller.signal)
        setProjects(response.data)
        setStatus('success')
      } catch (requestError) {
        if (controller.signal.aborted) return

        setError(requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar os projetos.')
        setStatus('error')
      }
    }

    void loadProjects()
    return () => controller.abort()
  }, [requestVersion])

  return { projects, status, error, reload }
}
