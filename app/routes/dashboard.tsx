import { redirect, useLoaderData, useRevalidator } from "react-router";
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
    const data = useLoaderData();
    const revalidator = useRevalidator();

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
        </div>
    );
}