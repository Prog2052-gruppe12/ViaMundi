import {z} from "zod";

export const formSchema = z.object({
    interests: z
        .object({
            nightLife: z.boolean(),
            history: z.boolean(),
            nature: z.boolean(),
            food: z.boolean(),
            culture: z.boolean(),
        })
        .refine(
            (interests) => Object.values(interests).some(Boolean),
            { message: "Velg minst én interesse" }
        ),
    other: z.string().optional(),
});