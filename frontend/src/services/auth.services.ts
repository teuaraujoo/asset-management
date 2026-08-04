import apiRoutes from "@/lib/api";

type LoginBody = {
    email: string;
    password: string;
};

type fetchProps = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    body?: LoginBody
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

export async function login(data: LoginBody) {
    return fetchRequest({ method: "POST", url: apiRoutes.login, body: data });
};

export async function logout() {
    return fetchRequest({ method: "POST", url: apiRoutes.logout });
};