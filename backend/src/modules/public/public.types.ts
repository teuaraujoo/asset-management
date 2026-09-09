export interface PublicProjectSummaryRecord {
    id: string;
    name: string;
    miniDescription: string;
    publishedAt: Date | null;
    slug: string;
    coverFile: CoverFile | null;
    // folderId: string;
    // description: string;
    // createdAt: Date;
    // updatedAt: Date;
    // published: boolean;
    // coverFileId: string | null;
};

export interface PublicProjectDetailsRecord extends PublicProjectSummaryRecord {
    description: string;
    createdAt: Date;
    files: PublicProjectFileRecord[];
}

export interface CoverFile {
    id: string;
    originalName: string;
    objectKey: string;
    thumbnailKey: string | null;
    mimeType: string;
};

export interface PublicProjectFileRecord {
    id: string,
    originalName: string,
    objectKey: string,
    thumbnailKey: string | null;
    mimeType: string;
};

export interface PublicFileResponseDTO {
    id: string;
    originalName: string;
    preview_url: string;
    mime_type: string;
};
