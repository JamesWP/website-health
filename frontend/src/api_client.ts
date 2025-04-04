const endpoint = 'http://localhost:8000/api';
const auth_endpoint = 'http://localhost:8000/api-token-auth/';

const user_rest_endpoint = `${endpoint}/users/`;

const UNAUTHORIZED = 401;

type Token = string;

async function getToken(username: string, password: string): Promise<Token> {
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