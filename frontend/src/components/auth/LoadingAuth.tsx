// import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, Loader2 } from "lucide-react";


export default function LoadingAuth() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-[380px]">
                <CardContent className="flex flex-col items-center gap-6 py-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>

                    <div className="space-y-2 text-center">
                        <h2 className="text-lg font-semibold">
                            Validando acesso
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Aguarde enquanto verificamos sua sessão e preparamos o dashboard.
                        </p>
                    </div>

                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    );
};