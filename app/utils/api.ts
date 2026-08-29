import { tokenService } from "./tokenService";

// This is a wrapper function for fetch. When the access 
// token has expired, the function will automatically 
// attempt to get a new access token by calling the refresh 
// API and then retry the original request.
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

    // if the 1st attemps fails try to get a new access token
    if (response.status === 401) {
        // Call and get a new access token
        response = await fetch("/api/v1/refresh", {
            method: "POST",
            credentials: "include",
        });

        // if the refresh fails clear the token from memory
        // and return the failure
        if (!response.ok) {
            tokenService.clearToken();
            return response
        }

        // if refresh is successful update the access token
        const { accessToken } = await response.json();
        tokenService.setToken(accessToken);
        headers.set("Authorization", `Bearer ${accessToken}`);

        // re-attemp the original call with the new access token
        response = await fetch(input, {
            ...init,
            headers,
        });
    }

    return response;
}