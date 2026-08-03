import apiRoutes from "@/lib/api";

type LoginBody = {
    email: string;
    password: string;
}

export async function login(data: LoginBody) {
    console.log("CHEGUEI AQUI")
    
    const response = await fetch(apiRoutes.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) throw new Error(result.message);
    
    console.log("CHEGUEI AQUI 2")
    return result;
};