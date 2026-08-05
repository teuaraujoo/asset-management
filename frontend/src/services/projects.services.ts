import apiRoutes from "@/lib/http/api";
import type { ProjectBody } from "@/@types/projects/projects.types";

type fetchProps = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    body?: ProjectBody
};

async function fetchRequest({ method, url, body }: fetchProps) {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    return result;
};

export async function createProject(data: ProjectBody) {
    return fetchRequest({ method: "POST", url: apiRoutes.projects, body: data });
};

export async function getProjects() {
    return fetchRequest({ method: "GET", url: apiRoutes.projects });
};

export async function updateProject(data: ProjectBody, id: string) {
    return fetchRequest({ method: "PATCH", url: `${apiRoutes.projects}/${id}`, body: data });
};

export async function deleteProject(id: string) {
    return fetchRequest({ method: "DELETE", url: `${apiRoutes.projects}/${id}` });
};