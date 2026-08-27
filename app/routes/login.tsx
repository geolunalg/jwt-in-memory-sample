import { Form, redirect } from "react-router";
import { tokenService } from "../utils/tokenService";
import type { Route } from "../+types/root";

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

    const token = await response.json();

    tokenService.setToken(token.accessToken);

    return redirect("/dashboard");
}

export default function Login() {
    return (
        <Form method="post">
            <input name="username" />
            <input name="password" type="password" />

            <button type="submit">
                Login
            </button>
        </Form>
    );
}