// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-blue-600">
      <h1 className="text-7xl font-bold">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Página não encontrada
      </h2>

      <p className="mt-2 text-muted-foreground">
        A página que você procura não existe ou foi movida.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-black px-6 py-3 text-white bg-blue-600"
      >
        Voltar para o início
      </Link>
    </main>
  );
}