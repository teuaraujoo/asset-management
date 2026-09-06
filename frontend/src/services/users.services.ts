import type { UpdateUserBody } from "@/@types/users/users.types";
import apiRoutes from "@/lib/http/api";
import fetchRequest from "@/lib/http/client";

export async function getUserProfile() {
    return fetchRequest({ method: "GET", url: `${apiRoutes.users}/me` });
};

export async function updateUserProfile(data: UpdateUserBody) {
    return fetchRequest({ method: "PATCH", url: `${apiRoutes.users}/me`, body: data });
};
