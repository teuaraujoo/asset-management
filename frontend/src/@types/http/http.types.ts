import type { ProjectBody } from "../projects/projects.types";
import type { LoginBody } from "../auth/auth.types";
import type { CompleteFileUploadBody, CreateFileBody } from "@/schemas/files/files.schema";
import type { UpdateUserBody } from "../users/users.types";

export type fetchProps = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    body?: LoginBody | ProjectBody | CreateFileBody | CompleteFileUploadBody | UpdateUserBody | { name: string } | { fileId: string };
};
