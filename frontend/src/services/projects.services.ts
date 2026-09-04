import apiRoutes from "@/lib/http/api";
import type { ProjectBody } from "@/@types/projects/projects.types";
import fetchRequest from "@/lib/http/client";

export async function createProject(data: ProjectBody) {
    return fetchRequest({ method: "POST", url: apiRoutes.projects, body: data });
};

export async function getProjects() {
    return fetchRequest({ method: "GET", url: apiRoutes.projects });
};

export async function getProjectById(id: string) {
    return fetchRequest({ method: "GET", url: `${apiRoutes.projects}/${id}` });
};

export async function updateProject(data: ProjectBody, id: string) {
    return fetchRequest({ method: "PATCH", url: `${apiRoutes.projects}/${id}`, body: data });
};

export async function deleteProject(id: string) {
    return fetchRequest({ method: "DELETE", url: `${apiRoutes.projects}/${id}` });
};

export async function publishProject(id: string) {
    return fetchRequest({ method: "POST", url: `${apiRoutes.projects}/${id}/publish` });
};

export async function setCover(id: string, data: { fileId: string }) {
    return fetchRequest({ method: "PUT", url: `${apiRoutes.projects}/${id}/cover`, body: data });
};

export async function removeCover(id: string, data: { fileId: string }) {
    return fetchRequest({ method: "DELETE", url: `${apiRoutes.projects}/${id}/cover`, body: data });
};