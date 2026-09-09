export interface PublicProjectCover {
  id: string
  url: string
  alt: string
  mimeType: string
}

export interface PublicProject {
  id: string
  slug: string | null
  name: string
  miniDescription: string
  publishedAt: string | null
  cover: PublicProjectCover | null
}

export interface PublicProjectsResponse {
  data: PublicProject[]
}

export interface PublicProjectFile {
  id: string
  originalName: string
  mime_type: string
  preview_url: string
}

export interface PublicProjectDetails {
  id: string
  slug: string
  name: string
  miniDescription: string
  publishedAt: string | null
  description: string
  createdAt: string
  cover_url: {
    id: string
    url: string | null
  } | null
  files: PublicProjectFile[]
}

export interface PublicProjectDetailsResponse {
  data: PublicProjectDetails
}
