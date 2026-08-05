import type { ProjectBody } from "../projects/projects.types";
import type { LoginBody } from "../auth/auth.types";

export type fetchProps = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    body?: LoginBody | ProjectBody
};