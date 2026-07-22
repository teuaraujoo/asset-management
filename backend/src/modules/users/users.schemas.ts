import z from "zod";

const passwordSchema = z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
    .regex(/\d/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial (ex: !@#$%^&*)." });

export const createUserSchema = z.object({
    name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres."),
    email: z.email("Informe um email válido."),
    password: passwordSchema
});

export type CreateUserBody = z.infer<typeof createUserSchema>;