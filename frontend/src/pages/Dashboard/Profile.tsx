import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { UserRound } from "lucide-react";
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
import { updateNameSchema } from "@/schemas/users/users.schema";
import { updateUserProfile } from "@/services/users.services";

function ProfileForm({ profile, onUpdated }: {
    profile: UserProfile;
    onUpdated: () => Promise<void>;
}) {
    const [name, setName] = useState(profile.name);
    const [isSaving, setIsSaving] = useState(false);
    const { refreshUser } = useAuthContext();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsed = updateNameSchema.safeParse({ name });

        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? "Nome inválido.");
            return;
        }

        if (parsed.data.name === profile.name) return;

        setIsSaving(true);

        try {
            await toast.promise(updateUserProfile(parsed.data), {
                loading: "Salvando perfil...",
                success: (response) => response.message,
                error: (error) => error instanceof Error ? error.message : "Erro ao atualizar perfil.",
            });

            await Promise.all([onUpdated(), refreshUser()]);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="profile-name">Nome</Label>
                <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    maxLength={150}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="profile-email">E-mail</Label>
                <Input id="profile-email" value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">
                    O e-mail pode ser alterado em Configurações.
                </p>
            </div>

            <Button type="submit" disabled={isSaving || name.trim() === profile.name}>
                {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
        </form>
    );
}

export default function DashboardProfilePage() {
    const { profile, isLoading, error, refetch } = useUserProfile();

    return (
        <main className="mx-auto w-full max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Meu perfil</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Atualize as informações exibidas na sua conta.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <UserRound className="size-5 text-primary" />
                    </div>
                    <CardTitle>Informações pessoais</CardTitle>
                    <CardDescription>Dados básicos utilizados no dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-9 w-36" />
                        </div>
                    ) : error ? (
                        <p className="text-sm text-destructive" role="alert">{error}</p>
                    ) : profile ? (
                        <ProfileForm key={profile.updated_at} profile={profile} onUpdated={refetch} />
                    ) : null}
                </CardContent>
            </Card>
        </main>
    );
}
