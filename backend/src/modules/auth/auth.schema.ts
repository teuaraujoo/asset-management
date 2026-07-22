import z from "zod";

export const loginUserSchema = z.object({
    email: z.email("Informe um email válido."),
    password: z.string().min(1, "A senha é obrigatória.")
});
export type LoginBody = z.infer<typeof loginUserSchema>;