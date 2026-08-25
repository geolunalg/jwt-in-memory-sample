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