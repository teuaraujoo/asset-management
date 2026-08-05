import type { fetchProps } from "@/@types/http/http.types";

export default async function fetchRequest({ method, url, body }: fetchProps) {
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