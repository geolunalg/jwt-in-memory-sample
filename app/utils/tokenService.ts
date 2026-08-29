// This is the class that manages the access 
// token in memory on the frontend.
class TokenService {
    #token: string | null = null;

    setToken(token: string) {
        this.#token = token;
    }

    getToken() {
        return this.#token;
    }

    clearToken() {
        this.#token = null;
    }
}

export const tokenService = new TokenService();