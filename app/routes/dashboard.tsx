import { redirect } from "react-router";
import { apiFetch } from "~/utils/api";

export async function clientLoader() {
    const response = await apiFetch("/api/v1/data");

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
    // useLoaderData()
    return <h1>Dashboard</h1>;
}