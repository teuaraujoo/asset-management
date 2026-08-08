export type ProjectBody = {
    name: string;
    mini_description: string;
    description: string;
};

export type Project = {
    id: string;
    folder_id: string;
    name: string;
    mini_description: string;
    description: string;
    slug: string;
    path: string;
    updated_at: string;
    user: {
        id: string
        name: string;
        email: string;
    };
};

export type UploadFileFormData = {
  projectId: string;
  folderId: string;
  file: File;
};