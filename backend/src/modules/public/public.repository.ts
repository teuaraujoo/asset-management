import {  PublicProjectSummaryRecord, PublicProjectDetailsRecord } from "./public.types";

export interface IPublicRepository {
    getProjects(): Promise< PublicProjectSummaryRecord[]>;

    getProjectBySlug(slug: string): Promise<PublicProjectDetailsRecord | null>;
};