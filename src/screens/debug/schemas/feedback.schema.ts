import { z } from "zod";

export const feedbackSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    rating: z.enum([
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
    ], {
        required_error: "Nota deve ser um número entre 0 e 10"
    }),
    useful: z.string().min(1, "Selecione uma opção"),
    usability: z.string().min(1, "Selecione uma opção"),
    fulfills: z.string().min(1, "Selecione uma opção"),
    improvements: z
        .string()
        .min(5, "Descreva pelo menos 5 caracteres"),
});