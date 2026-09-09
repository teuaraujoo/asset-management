import { useEffect, useState } from 'react'
import { getPublicProject } from '../services/public-projects'
import type { PublicProjectDetails } from '../types/public-project'

type RequestState = {
  project: PublicProjectDetails | null
  loading: boolean
  error: string | null
}

export function usePublicProject(slug: string) {
  const [state, setState] = useState<RequestState>({
    project: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadProject() {
      setState({ project: null, loading: true, error: null })

      try {
        const response = await getPublicProject(slug, controller.signal)
        setState({ project: response.data, loading: false, error: null })
      } catch (requestError) {
        if (controller.signal.aborted) return

        setState({
          project: null,
          loading: false,
          error: requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar o projeto.',
        })
      }
    }

    void loadProject()
    return () => controller.abort()
  }, [slug])

  return state
}
