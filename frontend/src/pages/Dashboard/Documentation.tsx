import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Loader2, Play, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Endpoint = {
    id: string;
    title: string;
    path: string;
    description: string;
    requiresAuth?: boolean;
    parameter?: string;
};

const apiBaseUrl = `${(import.meta.env.VITE_API_URL ?? "http://localhost:3000/").replace(/\/$/, "")}/api/v1`;

const overviewEndpoints: Endpoint[] = [
    {
        id: "public-projects",
        title: "Listar projetos publicados",
        path: "/public/projects",
        description: "Retorna os projetos disponíveis para aplicações consumidoras.",
    },
    {
        id: "health",
        title: "Status da API",
        path: "/health",
        description: "Verifica se a API está disponível.",
    },
];

const projectEndpoints: Endpoint[] = [
    {
        id: "projects",
        title: "Projetos da conta autenticada",
        path: "/projects",
        description: "Lista os projetos do usuário atualmente autenticado.",
        requiresAuth: true,
    },
    {
        id: "public-project",
        title: "Detalhes de um projeto",
        path: "/public/projects/:slug",
        description: "Retorna informações, capa e arquivos com URLs de preview.",
        parameter: "slug",
    },
];

const fileEndpoints: Endpoint[] = [
    {
        id: "project-files",
        title: "Arquivos de um projeto",
        path: "/projects/:projectId/files",
        description: "Lista os arquivos vinculados ao projeto autenticado.",
        requiresAuth: true,
        parameter: "projectId",
    },
    {
        id: "folder-files",
        title: "Arquivos de uma pasta",
        path: "/files/:folderId",
        description: "Lista os arquivos diretamente associados a uma pasta.",
        requiresAuth: true,
        parameter: "folderId",
    },
    {
        id: "file-preview",
        title: "URL de preview do arquivo",
        path: "/files/:fileId/preview",
        description: "Gera uma URL temporária para visualização do arquivo.",
        requiresAuth: true,
        parameter: "fileId",
    },
    {
        id: "file-download",
        title: "URL de download do arquivo",
        path: "/files/:fileId/download",
        description: "Gera uma URL temporária para download do arquivo.",
        requiresAuth: true,
        parameter: "fileId",
    },
];

function JsonValue({ value }: { value: unknown }) {
    const serialized = typeof value === "string"
        ? value
        : JSON.stringify(value, null, 2);

    if (typeof value === "string") return <>{serialized}</>;

    const tokenPattern = /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g;
    const tokens: ReactNode[] = [];
    let cursor = 0;

    for (const match of serialized.matchAll(tokenPattern)) {
        const token = match[0];
        const offset = match.index ?? 0;
        if (offset > cursor) tokens.push(serialized.slice(cursor, offset));

        const className = match[1]
            ? "json-key"
            : match[2]
                ? "json-string"
                : match[3] === "null"
                    ? "json-null"
                    : match[3]
                        ? "json-boolean"
                        : "json-number";

        tokens.push(<span className={className} key={`${offset}-${token}`}>{token}</span>);
        cursor = offset + token.length;
    }

    if (cursor < serialized.length) tokens.push(serialized.slice(cursor));
    return <>{tokens}</>;
}


type RequestState = {
    loading: boolean;
    status: number | null;
    response: unknown | null;
    error: string | null;
};

const initialRequestState: RequestState = {
    loading: false,
    status: null,
    response: null,
    error: null,
};

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
    const [parameterValue, setParameterValue] = useState("");
    const [requestState, setRequestState] = useState<RequestState>(initialRequestState);
    const [copied, setCopied] = useState(false);

    const requestPath = endpoint.parameter
        ? endpoint.path.replace(`:${endpoint.parameter}`, parameterValue.trim() || `:${endpoint.parameter}`)
        : endpoint.path;
    const requestUrl = endpoint.path === "/health"
        ? apiBaseUrl.replace("/api/v1", "") + requestPath
        : apiBaseUrl + requestPath;

    async function executeRequest() {
        if (endpoint.parameter && !parameterValue.trim()) {
            setRequestState({
                loading: false,
                status: null,
                response: null,
                error: `Informe o parâmetro ${endpoint.parameter}.`,
            });
            return;
        }

        setRequestState({ loading: true, status: null, response: null, error: null });

        try {
            const response = await fetch(requestUrl, {
                method: "GET",
                headers: { Accept: "application/json" },
                credentials: "include",
            });
            const rawBody = await response.text();
            let responseBody: unknown = rawBody;

            try {
                responseBody = JSON.parse(rawBody) as unknown;
            } catch {
                // Mantém texto quando servidor não retornar JSON.
            }

            setRequestState({
                loading: false,
                status: response.status,
                response: responseBody,
                error: response.ok ? null : "A API retornou um erro.",
            });
        } catch (requestError) {
            setRequestState({
                loading: false,
                status: null,
                response: null,
                error: requestError instanceof Error
                    ? requestError.message
                    : "Não foi possível conectar à API.",
            });
        }
    }

    async function copyUrl() {
        await navigator.clipboard.writeText(requestUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    return (
        <article className="rounded-xl border border-border bg-card/80 shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[11px] font-bold tracking-wider text-emerald-300">
                        GET
                    </span>
                    <div className="min-w-0">
                        <h2 className="font-semibold text-foreground">{endpoint.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                </div>
                {endpoint.requiresAuth ? (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                        Requer autenticação
                    </span>
                ) : (
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        Pública
                    </span>
                )}
            </div>

            <div className="border-y border-border bg-background/50 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-input/20 px-3 py-2 font-mono text-xs text-muted-foreground">
                        <span className="truncate">{requestUrl}</span>
                    </div>
                    {endpoint.parameter ? (
                        <Input
                            value={parameterValue}
                            onChange={(event) => setParameterValue(event.target.value)}
                            placeholder={`Informe ${endpoint.parameter}`}
                            aria-label={endpoint.parameter}
                            className="sm:w-48"
                        />
                    ) : null}
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={copyUrl} aria-label="Copiar URL">
                            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                        </Button>
                        <Button onClick={executeRequest} disabled={requestState.loading} className="gap-2">
                            {requestState.loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                            Executar
                        </Button>
                    </div>
                </div>
            </div>

            {(requestState.response !== null || requestState.error) && (
                <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resposta</span>
                        {requestState.status !== null ? (
                            <span className={requestState.status < 400 ? "text-xs font-medium text-emerald-400" : "text-xs font-medium text-destructive"}>
                                {requestState.status} {requestState.status < 400 ? "OK" : "Erro"}
                            </span>
                        ) : null}
                    </div>
                    {requestState.error ? <p className="mb-3 text-sm text-destructive">{requestState.error}</p> : null}
                    {requestState.response !== null ? (
                        <pre className="json-response max-h-[26rem] overflow-auto rounded-lg border border-border bg-[#0b0a0a] p-4 font-mono text-xs leading-relaxed">
                            <JsonValue value={requestState.response} />
                        </pre>
                    ) : null}
                </div>
            )}
        </article>
    );
}

export default function DashboardDocumentationPage() {
    return (
        <main className="mx-auto w-full max-w-6xl space-y-8 pb-10">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                    <Terminal className="size-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">API Reference</span>
                </div>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Documentação da API</h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            Consulte os endpoints disponíveis, teste requisições GET e inspecione as respostas em JSON.
                        </p>
                    </div>
                    <a
                        href={`${apiBaseUrl.replace("/api/v1", "")}/health`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        Abrir API <ExternalLink className="size-4" />
                    </a>
                </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-3" aria-label="Informações da API">
                <div className="rounded-xl border border-border bg-card/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Base URL</p>
                    <p className="mt-2 truncate font-mono text-sm text-foreground">{apiBaseUrl}</p>
                </div>
                <div className="rounded-xl border border-border bg-card/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Formato</p>
                    <p className="mt-2 text-sm font-medium text-foreground">JSON</p>
                </div>
                <div className="rounded-xl border border-border bg-card/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Autenticação</p>
                    <p className="mt-2 text-sm font-medium text-foreground">Cookie HttpOnly</p>
                </div>
            </section>

            <EndpointGroup title="Visão geral" endpoints={overviewEndpoints} />
            <EndpointGroup title="Projetos" endpoints={projectEndpoints} />
            <EndpointGroup title="Arquivos" endpoints={fileEndpoints} />
        </main>
    );
}

function EndpointGroup({ title, endpoints: groupEndpoints }: { title: string; endpoints: Endpoint[] }) {
    return (
        <section className="space-y-4" aria-labelledby={`endpoints-${title.toLowerCase()}`}>
            <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Endpoints</p>
                    <h2 id={`endpoints-${title.toLowerCase()}`} className="mt-1 text-xl font-semibold text-foreground">{title}</h2>
                </div>
                <ChevronDown className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="space-y-4">
                {groupEndpoints.map((endpoint) => <EndpointCard key={endpoint.id} endpoint={endpoint} />)}
            </div>
        </section>
    );
}
