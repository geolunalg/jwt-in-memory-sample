import { redirect, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { apiFetch } from "~/utils/api";
import { tokenService } from "~/utils/tokenService";

// This funtion runs on page load
export async function clientLoader() {
    // this API requires a auth token
    const response = await apiFetch("/api/v1/data");

    // if the auth fails redirect to login page
    if (response.status === 401) {
        return redirect("/login");
    }

    if (!response.ok) {
        throw new Response("Failed to load data", {
            status: response.status,
        });
    }

    return response.json();
}

export default function Dashboard() {
    // This gets the data from the load function so
    // we can later display it on screen
    const data = useLoaderData();

    // this reloads the data, if the access token is expired
    // the a refresh will be attempted by apiFetch. If all is
    // working correctly, user will stay on the `dashboard` page
    const revalidator = useRevalidator();

    // we will use navigate to revoke the token and get the users
    // loged out of the application and redirect to login page
    const navigate = useNavigate();
    async function logout() {
        const response = await apiFetch("/api/v1/revoke", {
            method: "POST",
            credentials: "include",
        });

        if (response.status != 204) {
            console.log("Something when wrong: " + response.status);
        }
        tokenService.clearToken();
        navigate("/login");
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <button
                onClick={() => revalidator.revalidate()}
                disabled={revalidator.state === "loading"}
            >
                {revalidator.state === "loading" ? "Refreshing..." : "Reload Data"}
            </button>

            <div>
                <button
                    onClick={logout}
                >Logout</button>
            </div>
        </div>
    );
}