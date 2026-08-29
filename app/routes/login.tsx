import { Form, redirect } from "react-router";
import { tokenService } from "../utils/tokenService";
import type { Route } from "../+types/root";

// When the login button is pressed, this function picks up the values 
// from the form and makes a request to get an access token. If successful, 
// the token is stored in memory.
export async function clientAction({ request }: Route.ClientActionArgs) {
    const formData = await request.formData();

    const response = await fetch("/api/v1/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: formData.get("username"),
            password: formData.get("password"),
        }),
    });

    if (!response.ok) {
        return {
            error: "Invalid username or password",
        };
    }

    // If the call is succefull store the access token to memory
    // and redirect the user to the dashboard.
    const token = await response.json();
    tokenService.setToken(token.accessToken);
    return redirect("/dashboard");
}

export default function Login() {
    return (
        <Form method="post">
            <input name="username" placeholder="username" />
            <input name="password" type="password" placeholder="password" />
            <button type="submit">
                Login
            </button>
        </Form>
    );
}