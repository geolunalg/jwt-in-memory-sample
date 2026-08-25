import { tokenService } from "./tokenService";

export async function apiFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
) {
    const headers = new Headers(init.headers);

    const token = tokenService.getToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        tokenService.clearToken();
    }

    return response;
}