const endpoint = 'http://localhost:8000/api';
const auth_endpoint = 'http://localhost:8000/api-token-auth/';

const website_rest_endpoint  = `${endpoint}/websites/`;

const UNAUTHORIZED = 401;

type Token = string;

export async function getToken(username: string, password: string): Promise<Token> {
    const response: any = await fetch(auth_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (response.status === UNAUTHORIZED) {
        throw new Error("Unauthorized");
    }

    const token = await response.json();
    return token.token;    
}

export async function getWebsites(token: Token): Promise<any> {
    const response: Response = await fetch(website_rest_endpoint, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
    });

    if (response.status === UNAUTHORIZED) {
        throw new Error("Unauthorized");
    }

    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}