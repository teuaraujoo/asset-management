import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Settings2 } from "lucide-react";
import type { UserProfile } from "@/@types/users/users.types";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/users/use-user-profile";
import { updateEmailSchema } from "@/schemas/users/users.schema";
import { updateUserProfile } from "@/services/users.services";

function SettingsForm({ profile, onUpdated }: {
    profile: UserProfile;
    onUpdated: () => Promise<void>;
}) {
    const [email, setEmail] = useState(profile.email);
    const [isSaving, setIsSaving] = useState(false);
    const { refreshUser } = useAuthContext();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsed = updateEmailSchema.safeParse({ email });

        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? "E-mail inválido.");
            return;
        }

        if (parsed.data.email === profile.email) return;

        setIsSaving(true);

        try {
            await toast.promise(updateUserProfile(parsed.data), {
                loading: "Salvando configurações...",
                success: (response) => response.message,
                error: (error) => error instanceof Error ? error.message : "Erro ao atualizar configurações.",
            });

            await Promise.all([onUpdated(), refreshUser()]);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="settings-email">E-mail da conta</Label>
                <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    maxLength={255}
                />
                <p className="text-xs text-muted-foreground">
                    Este endereço será usado nos próximos logins.
                </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                <p className="font-medium">Status da conta</p>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <span className={`size-2.5 rounded-full ${profile.is_active ? "bg-emerald-500" : "bg-destructive"}`} />
                    {profile.is_active ? "Conta ativa" : "Conta desativada"}
                </div>
            </div>

            <Button type="submit" disabled={isSaving || email.trim() === profile.email}>
                {isSaving ? "Salvando..." : "Salvar configurações"}
            </Button>
        </form>
    );
}

export default function DashboardSettingsPage() {
    const { profile, isLoading, error, refetch } = useUserProfile();

    return (
        <main className="mx-auto w-full max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gerencie os dados de acesso e o estado da conta.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Settings2 className="size-5 text-primary" />
                    </div>
                    <CardTitle>Conta</CardTitle>
                    <CardDescription>Configurações utilizadas para acessar o sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-9 w-44" />
                        </div>
                    ) : error ? (
                        <p className="text-sm text-destructive" role="alert">{error}</p>
                    ) : profile ? (
                        <SettingsForm key={profile.updated_at} profile={profile} onUpdated={refetch} />
                    ) : null}
                </CardContent>
            </Card>
        </main>
    );
}
