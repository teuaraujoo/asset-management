import {  PublicProjectSummaryRecord } from "./public.types";

export interface IPublicRepository {
    getProjects(): Promise< PublicProjectSummaryRecord[]>;

    // getProjectBySlug(slug: string): Promise<void>;
};