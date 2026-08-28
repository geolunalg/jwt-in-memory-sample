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

    let response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401) {
        response = await fetch("/api/v1/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            tokenService.clearToken();
            return response
        }

        const { accessToken } = await response.json();
        tokenService.setToken(accessToken);
        headers.set("Authorization", `Bearer ${accessToken}`);

        response = await fetch(input, {
            ...init,
            headers,
        });
    }

    return response;
}