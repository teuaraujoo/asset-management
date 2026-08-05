import apiRoutes from "@/lib/http/api";
import type { LoginBody } from "@/@types/auth/auth.types";
import fetchRequest from "@/lib/http/client";

export async function login(data: LoginBody) {
    return fetchRequest({ method: "POST", url: apiRoutes.login, body: data });
};

export async function logout() {
    return fetchRequest({ method: "POST", url: apiRoutes.logout });
};

export async function user() {
    return fetchRequest({ method: "GET", url: apiRoutes.me });
};