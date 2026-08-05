import { getProjects } from "@/services/projects.services";
import { useEffect } from "react";

export default function DashboardProjectsPage() {

    useEffect(() => {
        async function fetch() {
            const projects = await getProjects();
            console.log(projects);
        }
        fetch();
    }, []);

    return (
        <>
            <h1>Olá Projetos!</h1>
        </>
    );
};