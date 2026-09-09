import './App.css'
import { usePublicProjects } from './hooks/usePublicProjects'
import { usePublicProject } from './hooks/usePublicProject'
import type { PublicProject } from './types/public-project'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })

function formatPublishedAt(value: string | null) {
  if (!value) return 'Projeto selecionado'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Projeto selecionado' : dateFormatter.format(date)
}

function ProjectCard({ project, index }: { project: PublicProject; index: number }) {
  const content = (
    <>
      <div className="project-card__media">
        {project.cover ? (
          <img
            src={project.cover.url}
            alt={project.cover.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        ) : (
          <div className="project-card__placeholder" aria-label="Projeto sem imagem de capa">
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>
        )}
        <span className="project-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="project-card__content">
        <div>
          <p className="project-card__date">{formatPublishedAt(project.publishedAt)}</p>
          <h2>{project.name}</h2>
        </div>
        <p className="project-card__description">{project.miniDescription}</p>
        <span className="project-card__link">Ver projeto <span aria-hidden="true">↗</span></span>
      </div>
    </>
  )

  return project.slug ? (
    <a className="project-card" href={`/projects/${project.slug}`}>{content}</a>
  ) : (
    <article className="project-card project-card--unavailable">{content}</article>
  )
}

function ProjectDetailsPage({ slug }: { slug: string }) {
  const { project, loading, error } = usePublicProject(slug)

  if (loading) {
    return <main className="project-details project-details--loading"><div className="detail-loading" /></main>
  }

  if (error || !project) {
    return (
      <main className="project-details project-details--message">
        <a className="back-link" href="/">← Voltar aos projetos</a>
        <h1>{error ?? 'Projeto não encontrado.'}</h1>
      </main>
    )
  }

  const coverUrl = project.cover_url?.url ?? null

  return (
    <main className="project-details">
      <a className="back-link" href="/">← Todos os projetos</a>
      <header className="project-details__header">
        <p className="eyebrow">Projeto publicado</p>
        <h1>{project.name}</h1>
        <p className="project-details__intro">{project.miniDescription}</p>
      </header>

      {coverUrl ? (
        <figure className="project-details__cover">
          <img src={coverUrl} alt={`Capa do projeto ${project.name}`} fetchPriority="high" />
        </figure>
      ) : null}

      <div className="project-details__body">
        <div className="project-details__copy">
          <p className="eyebrow">Sobre o projeto</p>
          <p>{project.description}</p>
        </div>
        <p className="project-details__count">{project.files.length} {project.files.length === 1 ? 'arquivo' : 'arquivos'} publicados</p>
      </div>

      {project.files.length > 0 ? (
        <section className="project-gallery" aria-label={`Arquivos do projeto ${project.name}`}>
          {project.files.map((file, index) => (
            <figure className="project-gallery__item" key={file.id}>
              {file.mime_type.startsWith('video/') ? (
                <video
                  src={file.preview_url}
                  controls
                  preload={index < 2 ? 'metadata' : 'none'}
                  aria-label={file.originalName}
                />
              ) : (
                <img
                  src={file.preview_url}
                  alt={file.originalName}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              )}
              <figcaption>{file.originalName}</figcaption>
            </figure>
          ))}
        </section>
      ) : (
        <p className="projects-message">Este projeto ainda não possui arquivos publicados.</p>
      )}
    </main>
  )
}

function LoadingProjects() {
  return (
    <div className="projects-grid" aria-label="Carregando projetos" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <div className="project-skeleton" key={item}>
          <div className="project-skeleton__media" />
          <div className="project-skeleton__line project-skeleton__line--title" />
          <div className="project-skeleton__line" />
        </div>
      ))}
    </div>
  )
}

function ProjectsLandingPage() {
  const { projects, status, error, reload } = usePublicProjects()

  return (
    <main>
      <section className="projects-section" aria-labelledby="projects-title">
        <header className="projects-header">
          <div>
            <p className="eyebrow">Trabalhos selecionados · 2024—26</p>
            <h1 id="projects-title">Projetos que transformam ideias em produto.</h1>
          </div>
          <p className="projects-intro">
            Uma seleção de experiências digitais, sistemas e interfaces construídas com estratégia,
            clareza e atenção ao detalhe.
          </p>
        </header>

        {status === 'loading' ? <LoadingProjects /> : null}
        {status === 'error' ? (
          <div className="projects-message" role="alert">
            <p>{error}</p>
            <button type="button" onClick={reload}>Tentar novamente</button>
          </div>
        ) : null}
        {status === 'success' && projects.length === 0 ? (
          <div className="projects-message">
            <p>Novos projetos estão sendo preparados para publicação.</p>
          </div>
        ) : null}
        {status === 'success' && projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

function App() {
  const projectSlug = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1]

  return projectSlug
    ? <ProjectDetailsPage slug={decodeURIComponent(projectSlug)} />
    : <ProjectsLandingPage />
}

export default App
