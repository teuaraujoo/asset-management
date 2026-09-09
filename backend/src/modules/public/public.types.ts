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

export interface CoverFile {
    id: string;
    originalName: string;
    objectKey: string;
    thumbnailKey: string | null;
    mimeType: string;
};
